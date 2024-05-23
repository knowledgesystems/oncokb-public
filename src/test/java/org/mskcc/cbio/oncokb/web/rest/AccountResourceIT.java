package org.mskcc.cbio.oncokb.web.rest;

import org.mskcc.cbio.oncokb.OncokbPublicApp;
import org.mskcc.cbio.oncokb.config.Constants;
import org.mskcc.cbio.oncokb.config.application.ApplicationProperties;
import org.mskcc.cbio.oncokb.config.application.RecaptchaProperties;
import org.mskcc.cbio.oncokb.domain.Company;
import org.mskcc.cbio.oncokb.domain.User;
import org.mskcc.cbio.oncokb.domain.enumeration.CompanyType;
import org.mskcc.cbio.oncokb.domain.enumeration.LicenseModel;
import org.mskcc.cbio.oncokb.domain.enumeration.LicenseStatus;
import org.mskcc.cbio.oncokb.domain.enumeration.LicenseType;
import org.mskcc.cbio.oncokb.repository.*;
import org.mskcc.cbio.oncokb.security.AuthoritiesConstants;
import org.mskcc.cbio.oncokb.service.UserService;
import org.mskcc.cbio.oncokb.service.dto.CompanyDTO;
import org.mskcc.cbio.oncokb.service.dto.PasswordChangeDTO;
import org.mskcc.cbio.oncokb.service.dto.UserDTO;
import org.mskcc.cbio.oncokb.service.dto.UserDetailsDTO;
import org.mskcc.cbio.oncokb.service.dto.useradditionalinfo.AdditionalInfoDTO;
import org.mskcc.cbio.oncokb.service.dto.useradditionalinfo.ApiAccessRequest;
import org.mskcc.cbio.oncokb.service.mapper.CompanyMapper;
import org.mskcc.cbio.oncokb.service.mapper.UserDetailsMapper;
import org.mskcc.cbio.oncokb.web.rest.vm.KeyAndPasswordVM;
import org.mskcc.cbio.oncokb.web.rest.vm.ManagedUserVM;
import org.apache.commons.lang3.RandomStringUtils;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;


import java.io.IOException;
import java.time.Instant;
import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mskcc.cbio.oncokb.web.rest.AccountResourceIT.TEST_USER_LOGIN;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link AccountResource} REST controller.
 */
@AutoConfigureMockMvc
@WithMockUser(value = TEST_USER_LOGIN)
@SpringBootTest(classes = OncokbPublicApp.class)
public class AccountResourceIT {
    static final String TEST_USER_LOGIN = "test";

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserDetailsRepository userDetailsRepository;

    @Autowired
    private UserDetailsMapper userDetailsMapper;

    @Autowired
    private CompanyMapper companyMapper;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private AuthorityRepository authorityRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private MockMvc restAccountMockMvc;

    @Autowired
    private ApplicationProperties applicationProperties;

    RecaptchaProperties recaptchaProp;

    private AccountResource accountResource;

    @BeforeEach
    public void setUp() throws IOException {
        recaptchaProp = new RecaptchaProperties();
        recaptchaProp.setProjectId("symbolic-nation-320615");
        recaptchaProp.setSiteKey("6LfAOe4jAAAAANjzxWQ8mKilcvk1QvLLohd7EV7F");
        recaptchaProp.setThreshold((float) 0.5);
        applicationProperties.setRecaptcha(recaptchaProp);

        accountResource = new AccountResource(userRepository, userService, null, null, null, null, null, passwordEncoder, null, null, applicationProperties);
    }

    @Test
    @WithUnauthenticatedMockUser
    public void testNonAuthenticatedUser() throws Exception {
        restAccountMockMvc.perform(get("/api/authenticate")
                .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(content().string(""));
    }

    @Test
    public void testAuthenticatedUser() throws Exception {
        restAccountMockMvc.perform(get("/api/authenticate")
                .with(request -> {
                    request.setRemoteUser(TEST_USER_LOGIN);
                    return request;
                })
                .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(content().string(TEST_USER_LOGIN));
    }

    @Test
    public void testGetExistingAccount() throws Exception {
        Set<String> authorities = new HashSet<>();
        authorities.add(AuthoritiesConstants.ADMIN);

        UserDTO user = new UserDTO();
        user.setLogin(TEST_USER_LOGIN);
        user.setFirstName("john");
        user.setLastName("doe");
        user.setEmail("john.doe@oncokb.org");
        user.setImageUrl("http://placehold.it/50x50");
        user.setLangKey("en");
        user.setAuthorities(authorities);
        userService.createUser(user, Optional.empty(), Optional.empty());

        restAccountMockMvc.perform(get("/api/account")
                .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.login").value(TEST_USER_LOGIN))
            .andExpect(jsonPath("$.firstName").value("john"))
            .andExpect(jsonPath("$.lastName").value("doe"))
            .andExpect(jsonPath("$.email").value("john.doe@oncokb.org"))
            .andExpect(jsonPath("$.imageUrl").value("http://placehold.it/50x50"))
            .andExpect(jsonPath("$.langKey").value("en"))
            .andExpect(jsonPath("$.authorities").value(AuthoritiesConstants.ADMIN));
    }

    @Test
    public void testGetUnknownAccount() throws Exception {
        restAccountMockMvc.perform(get("/api/account")
                .accept(MediaType.APPLICATION_PROBLEM_JSON))
            .andExpect(status().isInternalServerError());
    }

    @Test
    @Transactional
    public void testRegisterValid() throws Exception {
        ManagedUserVM validUser = new ManagedUserVM();
        validUser.setLogin("test-register-valid");
        validUser.setPassword("password");
        validUser.setFirstName("Alice");
        validUser.setLastName("Test");
        validUser.setEmail("test-register-valid@example.com");
        validUser.setImageUrl("http://placehold.it/50x50");
        validUser.setLangKey(Constants.DEFAULT_LANGUAGE);
        validUser.setAuthorities(Collections.singleton(AuthoritiesConstants.USER));
        assertThat(userRepository.findOneWithAuthoritiesByLogin("test-register-valid").isPresent()).isFalse();

        restAccountMockMvc.perform(
                post("/api/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(validUser))
                    .header("g-recaptcha-response", Constants.TESTING_TOKEN))
            .andExpect(status().isCreated());

        assertThat(userRepository.findOneWithAuthoritiesByLogin("test-register-valid").isPresent()).isTrue();
    }

    @Test
    @Transactional
    public void testRegisterInvalidLogin() throws Exception {
        ManagedUserVM invalidUser = new ManagedUserVM();
        invalidUser.setLogin("funky-log(n");// <-- invalid
        invalidUser.setPassword("password");
        invalidUser.setFirstName("Funky");
        invalidUser.setLastName("One");
        invalidUser.setEmail("funky@example.com");
        invalidUser.setActivated(true);
        invalidUser.setImageUrl("http://placehold.it/50x50");
        invalidUser.setLangKey(Constants.DEFAULT_LANGUAGE);
        invalidUser.setAuthorities(Collections.singleton(AuthoritiesConstants.USER));

        restAccountMockMvc.perform(
                post("/api/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(invalidUser))
                    .header("g-recaptcha-response", Constants.TESTING_TOKEN))
            .andExpect(status().isBadRequest());

        Optional<User> user = userRepository.findOneWithAuthoritiesByEmailIgnoreCase("funky@example.com");
        assertThat(user.isPresent()).isFalse();
    }

    @Test
    @Transactional
    public void testRegisterInvalidEmail() throws Exception {
        ManagedUserVM invalidUser = new ManagedUserVM();
        invalidUser.setLogin("bob");
        invalidUser.setPassword("password");
        invalidUser.setFirstName("Bob");
        invalidUser.setLastName("Green");
        invalidUser.setEmail("invalid");// <-- invalid
        invalidUser.setActivated(true);
        invalidUser.setImageUrl("http://placehold.it/50x50");
        invalidUser.setLangKey(Constants.DEFAULT_LANGUAGE);
        invalidUser.setAuthorities(Collections.singleton(AuthoritiesConstants.USER));

        restAccountMockMvc.perform(
                post("/api/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(invalidUser))
                    .header("g-recaptcha-response", Constants.TESTING_TOKEN))
            .andExpect(status().isBadRequest());

        Optional<User> user = userRepository.findOneWithAuthoritiesByLogin("bob");
        assertThat(user.isPresent()).isFalse();
    }

    @Test
    @Transactional
    public void testRegisterInvalidPassword() throws Exception {
        ManagedUserVM invalidUser = new ManagedUserVM();
        invalidUser.setLogin("bob");
        invalidUser.setPassword("123");// password with only 3 digits
        invalidUser.setFirstName("Bob");
        invalidUser.setLastName("Green");
        invalidUser.setEmail("bob@example.com");
        invalidUser.setActivated(true);
        invalidUser.setImageUrl("http://placehold.it/50x50");
        invalidUser.setLangKey(Constants.DEFAULT_LANGUAGE);
        invalidUser.setAuthorities(Collections.singleton(AuthoritiesConstants.USER));

        restAccountMockMvc.perform(
                post("/api/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(invalidUser))
                    .header("g-recaptcha-response", Constants.TESTING_TOKEN))
            .andExpect(status().isBadRequest());

        Optional<User> user = userRepository.findOneWithAuthoritiesByLogin("bob");
        assertThat(user.isPresent()).isFalse();
    }

    @Test
    @Transactional
    public void testRegisterNullPassword() throws Exception {
        ManagedUserVM invalidUser = new ManagedUserVM();
        invalidUser.setLogin("bob");
        invalidUser.setPassword(null);// invalid null password
        invalidUser.setFirstName("Bob");
        invalidUser.setLastName("Green");
        invalidUser.setEmail("bob@example.com");
        invalidUser.setActivated(true);
        invalidUser.setImageUrl("http://placehold.it/50x50");
        invalidUser.setLangKey(Constants.DEFAULT_LANGUAGE);
        invalidUser.setAuthorities(Collections.singleton(AuthoritiesConstants.USER));

        restAccountMockMvc.perform(
                post("/api/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(invalidUser))
                    .header("g-recaptcha-response", Constants.TESTING_TOKEN))
            .andExpect(status().isBadRequest());

        Optional<User> user = userRepository.findOneWithAuthoritiesByLogin("bob");
        assertThat(user.isPresent()).isFalse();
    }

    @Test
    @Transactional
    public void testRegisterDuplicateLogin() throws Exception {
        // First registration
        ManagedUserVM firstUser = new ManagedUserVM();
        firstUser.setLogin("alice");
        firstUser.setPassword("password");
        firstUser.setFirstName("Alice");
        firstUser.setLastName("Something");
        firstUser.setEmail("alice@example.com");
        firstUser.setImageUrl("http://placehold.it/50x50");
        firstUser.setLangKey(Constants.DEFAULT_LANGUAGE);
        firstUser.setAuthorities(Collections.singleton(AuthoritiesConstants.USER));

        // Duplicate login, different email
        ManagedUserVM secondUser = new ManagedUserVM();
        secondUser.setLogin(firstUser.getLogin());
        secondUser.setPassword(firstUser.getPassword());
        secondUser.setFirstName(firstUser.getFirstName());
        secondUser.setLastName(firstUser.getLastName());
        secondUser.setEmail("alice2@example.com");
        secondUser.setImageUrl(firstUser.getImageUrl());
        secondUser.setLangKey(firstUser.getLangKey());
        secondUser.setCreatedBy(firstUser.getCreatedBy());
        secondUser.setCreatedDate(firstUser.getCreatedDate());
        secondUser.setLastModifiedBy(firstUser.getLastModifiedBy());
        secondUser.setLastModifiedDate(firstUser.getLastModifiedDate());
        secondUser.setAuthorities(new HashSet<>(firstUser.getAuthorities()));

        // First user
        restAccountMockMvc.perform(
                post("/api/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(firstUser))
                    .header("g-recaptcha-response", Constants.TESTING_TOKEN))
            .andExpect(status().isCreated());

        Optional<User> testUser1 = userRepository.findOneWithAuthoritiesByEmailIgnoreCase("alice@example.com");
        assertThat(testUser1.isPresent()).isTrue();

        // Second (non activated) user
        restAccountMockMvc.perform(
                post("/api/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(secondUser))
                    .header("g-recaptcha-response", Constants.TESTING_TOKEN))
            .andExpect(status().is4xxClientError());

        Optional<User> testUser2 = userRepository.findOneWithAuthoritiesByEmailIgnoreCase("alice2@example.com");
        assertThat(testUser2.isPresent()).isFalse();
    }

    @Test
    @Transactional
    public void testRegisterDuplicateEmail() throws Exception {
        // First user
        ManagedUserVM firstUser = new ManagedUserVM();
        firstUser.setLogin("test-register-duplicate-email");
        firstUser.setPassword("password");
        firstUser.setFirstName("Alice");
        firstUser.setLastName("Test");
        firstUser.setEmail("test-register-duplicate-email@example.com");
        firstUser.setImageUrl("http://placehold.it/50x50");
        firstUser.setLangKey(Constants.DEFAULT_LANGUAGE);
        firstUser.setAuthorities(Collections.singleton(AuthoritiesConstants.USER));

        // Register first user
        restAccountMockMvc.perform(
                post("/api/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(firstUser))
                    .header("g-recaptcha-response", Constants.TESTING_TOKEN))
            .andExpect(status().isCreated());

        Optional<User> testUser1 = userRepository.findOneWithAuthoritiesByLogin("test-register-duplicate-email");
        assertThat(testUser1.isPresent()).isTrue();

        // Duplicate email, different login
        ManagedUserVM secondUser = new ManagedUserVM();
        secondUser.setLogin("test-register-duplicate-email-2");
        secondUser.setPassword(firstUser.getPassword());
        secondUser.setFirstName(firstUser.getFirstName());
        secondUser.setLastName(firstUser.getLastName());
        secondUser.setEmail(firstUser.getEmail());
        secondUser.setImageUrl(firstUser.getImageUrl());
        secondUser.setLangKey(firstUser.getLangKey());
        secondUser.setAuthorities(new HashSet<>(firstUser.getAuthorities()));

        // Register second (non activated) user
        restAccountMockMvc.perform(
                post("/api/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(secondUser))
                    .header("g-recaptcha-response", Constants.TESTING_TOKEN))
            .andExpect(status().isBadRequest());

        Optional<User> testUser2 = userRepository.findOneWithAuthoritiesByLogin("test-register-duplicate-email");
        assertThat(testUser2.isPresent()).isTrue();

        Optional<User> testUser3 = userRepository.findOneWithAuthoritiesByLogin("test-register-duplicate-email-2");
        assertThat(testUser3.isPresent()).isFalse();

        // Duplicate email - with uppercase email address
        ManagedUserVM userWithUpperCaseEmail = new ManagedUserVM();
        userWithUpperCaseEmail.setId(firstUser.getId());
        userWithUpperCaseEmail.setLogin("test-register-duplicate-email-3");
        userWithUpperCaseEmail.setPassword(firstUser.getPassword());
        userWithUpperCaseEmail.setFirstName(firstUser.getFirstName());
        userWithUpperCaseEmail.setLastName(firstUser.getLastName());
        userWithUpperCaseEmail.setEmail("TEST-register-duplicate-email@example.com");
        userWithUpperCaseEmail.setImageUrl(firstUser.getImageUrl());
        userWithUpperCaseEmail.setLangKey(firstUser.getLangKey());
        userWithUpperCaseEmail.setAuthorities(new HashSet<>(firstUser.getAuthorities()));

        // Register third (not activated) user
        restAccountMockMvc.perform(
                post("/api/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userWithUpperCaseEmail))
                    .header("g-recaptcha-response", Constants.TESTING_TOKEN))
            .andExpect(status().isBadRequest());

        Optional<User> testUser4 = userRepository.findOneWithAuthoritiesByLogin("test-register-duplicate-email-3");
        assertThat(testUser4.isPresent()).isFalse();
    }

    @Test
    @Transactional
    public void testRegisterAdminIsIgnored() throws Exception {
        ManagedUserVM validUser = new ManagedUserVM();
        validUser.setLogin("badguy");
        validUser.setPassword("password");
        validUser.setFirstName("Bad");
        validUser.setLastName("Guy");
        validUser.setEmail("badguy@example.com");
        validUser.setActivated(true);
        validUser.setImageUrl("http://placehold.it/50x50");
        validUser.setLangKey(Constants.DEFAULT_LANGUAGE);
        validUser.setAuthorities(Collections.singleton(AuthoritiesConstants.ADMIN));

        restAccountMockMvc.perform(
                post("/api/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(validUser))
                    .header("g-recaptcha-response", Constants.TESTING_TOKEN))
            .andExpect(status().isCreated());

        Optional<User> userDup = userRepository.findOneWithAuthoritiesByLogin("badguy");
        assertThat(userDup.isPresent()).isTrue();
        assertThat(userDup.get().getAuthorities()).hasSize(1)
            .containsExactly(authorityRepository.findById(AuthoritiesConstants.USER).get());
    }

    @Test
    @Transactional
    public void testActivateAccount() throws Exception {
        final String activationKey = "some activation key";
        final String userLogin = "activate-account";
        User user = new User();
        user.setLogin(userLogin);
        user.setEmail("activate-account@example.com");
        user.setPassword(RandomStringUtils.random(60));
        user.setActivated(false);
        user.setActivationKey(activationKey);

        userRepository.saveAndFlush(user);

        restAccountMockMvc.perform(get("/api/activate?key={activationKey}&login={userLogin}", activationKey, userLogin))
            .andExpect(status().isOk());

        user = userRepository.findOneWithAuthoritiesByLogin(user.getLogin()).orElse(null);
        // Users are not activated until either their email matches a FULL company
        // or approved manually.
        assertThat(user.getActivated()).isFalse();
    }

    @Test
    @Transactional
    public void testActivateAccountWithWrongKey() throws Exception {
        final String activationKey = "some activation key";
        final String userLogin = "activate-account";
        User user = new User();
        user.setLogin(userLogin);
        user.setEmail("activate-account@example.com");
        user.setPassword(RandomStringUtils.random(60));
        user.setActivated(false);
        user.setActivationKey(activationKey);

        userRepository.saveAndFlush(user);

        restAccountMockMvc.perform(get("/api/activate?key=wrongActivationKey&login={userLogin}", userLogin))
            .andExpect(status().isInternalServerError());
    }

    @Test
    @Transactional
    public void testActivateAccountWithNonExistingLogin() throws Exception {
        final String activationKey = "some activation key";
        final String userLogin = "activate-account";
        User user = new User();
        user.setLogin(userLogin);
        user.setEmail("activate-account@example.com");
        user.setPassword(RandomStringUtils.random(60));
        user.setActivated(false);
        user.setActivationKey(activationKey);

        userRepository.saveAndFlush(user);

        restAccountMockMvc.perform(get("/api/activate?key={activationKey}&login=non-existing-account", activationKey))
            .andExpect(status().isInternalServerError());
    }

    @Test
    @Transactional
    public void testActivateAccountWithoutApiRequestAndNoInstitution() throws Exception {
        final String activationKey = "some activation key";
        final String userLogin = "activate-account";
        final String companyDomain = "example.com";

        User user = new User();
        user.setLogin(userLogin);
        user.setEmail("activate-account@" + companyDomain);
        user.setPassword(RandomStringUtils.random(60));
        user.setActivated(false);
        user.setActivationKey(activationKey);

        userRepository.saveAndFlush(user);

        restAccountMockMvc.perform(get("/api/activate?key={activationKey}&login={userLogin}", activationKey, userLogin))
            .andExpect(status().isOk());

        user = userRepository.findOneWithAuthoritiesByLogin(user.getLogin()).orElse(null);

        // For user without any institution association, we should not auto-approve
        assertThat(user.getActivated()).isFalse();
    }

    @Test
    @Transactional
    public void testActivateAccountWithoutApiRequestAndAcademic() throws Exception {
        final String activationKey = "some activation key";
        final String userLogin = "activate-account";
        final String companyDomain = "example.com";

        User user = new User();
        user.setLogin(userLogin);
        user.setEmail("activate-account@" + companyDomain);
        user.setPassword(RandomStringUtils.random(60));
        user.setActivated(false);
        user.setActivationKey(activationKey);

        userRepository.saveAndFlush(user);

        CompanyDTO companyDTO = new CompanyDTO();
        companyDTO.setName("test company");
        companyDTO.setLicenseType(LicenseType.ACADEMIC);
        companyDTO.setLicenseStatus(LicenseStatus.REGULAR);
        companyDTO.setLicenseModel(LicenseModel.FULL);
        companyDTO.setCompanyType(CompanyType.PARENT);
        companyDTO.setCompanyDomains(Collections.singleton(companyDomain));
        companyRepository.saveAndFlush(companyMapper.toEntity(companyDTO));

        restAccountMockMvc.perform(get("/api/activate?key={activationKey}&login={userLogin}", activationKey, userLogin))
            .andExpect(status().isOk());

        user = userRepository.findOneWithAuthoritiesByLogin(user.getLogin()).orElse(null);

        // For academic user with a valid institution license, we should auto-approve when API access is not requested
        assertThat(user.getActivated()).isTrue();
    }

    @Test
    @Transactional
    public void testActivateAccountWithoutApiRequestAndCommercial() throws Exception {
        final String activationKey = "some activation key";
        final String userLogin = "activate-account";
        final String companyDomain = "example.com";

        User user = new User();
        user.setLogin(userLogin);
        user.setEmail("activate-account@" + companyDomain);
        user.setPassword(RandomStringUtils.random(60));
        user.setActivated(false);
        user.setActivationKey(activationKey);

        userRepository.saveAndFlush(user);

        CompanyDTO companyDTO = new CompanyDTO();
        companyDTO.setName("test company");
        companyDTO.setLicenseType(LicenseType.COMMERCIAL);
        companyDTO.setLicenseStatus(LicenseStatus.REGULAR);
        companyDTO.setLicenseModel(LicenseModel.FULL);
        companyDTO.setCompanyType(CompanyType.PARENT);
        companyDTO.setCompanyDomains(Collections.singleton(companyDomain));
        companyRepository.saveAndFlush(companyMapper.toEntity(companyDTO));

        restAccountMockMvc.perform(get("/api/activate?key={activationKey}&login={userLogin}", activationKey, userLogin))
            .andExpect(status().isOk());

        user = userRepository.findOneWithAuthoritiesByLogin(user.getLogin()).orElse(null);

        // For commercial user with a valid company license, we should auto-approve when API access is not requested
        assertThat(user.getActivated()).isTrue();
    }

    @Test
    @Transactional
    public void testActivateAccountWithApiRequestAndNoInstitution() throws Exception {
        final String activationKey = "some activation key";
        final String userLogin = "activate-account";
        final String companyDomain = "example.com";

        User user = new User();
        user.setLogin(userLogin);
        user.setEmail("activate-account@" + companyDomain);
        user.setPassword(RandomStringUtils.random(60));
        user.setActivated(false);
        user.setActivationKey(activationKey);

        userRepository.saveAndFlush(user);

        UserDetailsDTO userDetailsDTO = new UserDetailsDTO();
        userDetailsDTO.setUserId(user.getId());

        AdditionalInfoDTO additionalInfoDTO = new AdditionalInfoDTO();
        ApiAccessRequest apiAccessRequest = new ApiAccessRequest();
        apiAccessRequest.setRequested(true);
        apiAccessRequest.setJustification("random request");
        additionalInfoDTO.setApiAccessRequest(apiAccessRequest);
        userDetailsDTO.setAdditionalInfo(additionalInfoDTO);
        userDetailsRepository.saveAndFlush(userDetailsMapper.toEntity(userDetailsDTO));

        restAccountMockMvc.perform(get("/api/activate?key={activationKey}&login={userLogin}", activationKey, userLogin))
            .andExpect(status().isOk());

        user = userRepository.findOneWithAuthoritiesByLogin(user.getLogin()).orElse(null);

        // For user without a company, we should not auto-approve when API access is requested
        assertThat(user.getActivated()).isFalse();
    }

    @Test
    @Transactional
    public void testActivateAccountWithApiRequestAndAcademic() throws Exception {
        final String activationKey = "some activation key";
        final String userLogin = "activate-account";
        final String companyDomain = "example.com";

        User user = new User();
        user.setLogin(userLogin);
        user.setEmail("activate-account@" + companyDomain);
        user.setPassword(RandomStringUtils.random(60));
        user.setActivated(false);
        user.setActivationKey(activationKey);

        userRepository.saveAndFlush(user);

        CompanyDTO companyDTO = new CompanyDTO();
        companyDTO.setName("test company");
        companyDTO.setLicenseType(LicenseType.ACADEMIC);
        companyDTO.setLicenseStatus(LicenseStatus.REGULAR);
        companyDTO.setLicenseModel(LicenseModel.FULL);
        companyDTO.setCompanyType(CompanyType.PARENT);
        companyDTO.setCompanyDomains(Collections.singleton(companyDomain));
        Company company = companyRepository.saveAndFlush(companyMapper.toEntity(companyDTO));

        UserDetailsDTO userDetailsDTO = new UserDetailsDTO();
        userDetailsDTO.setUserId(user.getId());
        userDetailsDTO.setCompanyId(company.getId());

        AdditionalInfoDTO additionalInfoDTO = new AdditionalInfoDTO();
        ApiAccessRequest apiAccessRequest = new ApiAccessRequest();
        apiAccessRequest.setRequested(true);
        apiAccessRequest.setJustification("random request");
        additionalInfoDTO.setApiAccessRequest(apiAccessRequest);
        userDetailsDTO.setAdditionalInfo(additionalInfoDTO);
        userDetailsRepository.saveAndFlush(userDetailsMapper.toEntity(userDetailsDTO));

        restAccountMockMvc.perform(get("/api/activate?key={activationKey}&login={userLogin}", activationKey, userLogin))
            .andExpect(status().isOk());

        user = userRepository.findOneWithAuthoritiesByLogin(user.getLogin()).orElse(null);

        // For academic user with a valid institution license, we should not auto-approve when API access is requested
        assertThat(user.getActivated()).isFalse();
    }

    @Test
    @Transactional
    public void testActivateAccountWithApiRequestAndCommercial() throws Exception {
        final String activationKey = "some activation key";
        final String userLogin = "activate-account";
        final String companyDomain = "example.com";

        User user = new User();
        user.setLogin(userLogin);
        user.setEmail("activate-account@" + companyDomain);
        user.setPassword(RandomStringUtils.random(60));
        user.setActivated(false);
        user.setActivationKey(activationKey);

        userRepository.saveAndFlush(user);

        CompanyDTO companyDTO = new CompanyDTO();
        companyDTO.setName("test company");
        companyDTO.setLicenseType(LicenseType.COMMERCIAL);
        companyDTO.setLicenseStatus(LicenseStatus.REGULAR);
        companyDTO.setLicenseModel(LicenseModel.FULL);
        companyDTO.setCompanyType(CompanyType.PARENT);
        companyDTO.setCompanyDomains(Collections.singleton(companyDomain));
        Company company = companyRepository.saveAndFlush(companyMapper.toEntity(companyDTO));

        UserDetailsDTO userDetailsDTO = new UserDetailsDTO();
        userDetailsDTO.setUserId(user.getId());
        userDetailsDTO.setCompanyId(company.getId());

        AdditionalInfoDTO additionalInfoDTO = new AdditionalInfoDTO();
        ApiAccessRequest apiAccessRequest = new ApiAccessRequest();
        apiAccessRequest.setRequested(true);
        apiAccessRequest.setJustification("random request");
        additionalInfoDTO.setApiAccessRequest(apiAccessRequest);
        userDetailsDTO.setAdditionalInfo(additionalInfoDTO);
        userDetailsRepository.saveAndFlush(userDetailsMapper.toEntity(userDetailsDTO));

        restAccountMockMvc.perform(get("/api/activate?key={activationKey}&login={userLogin}", activationKey, userLogin))
            .andExpect(status().isOk());

        user = userRepository.findOneWithAuthoritiesByLogin(user.getLogin()).orElse(null);

        // For commercial user with a valid company license, we should auto-approve when API access is requested
        assertThat(user.getActivated()).isTrue();
    }

    @Test
    @Transactional
    @WithMockUser("save-account")
    public void testSaveAccount() throws Exception {
        User user = new User();
        user.setLogin("save-account");
        user.setEmail("save-account@example.com");
        user.setPassword(RandomStringUtils.random(60));
        user.setActivated(true);
        userRepository.saveAndFlush(user);
        User savedUser = userRepository.findById(user.getId()).get();

        UserDTO userDTO = new UserDTO();
        userDTO.setId(savedUser.getId());
        userDTO.setLogin("not-used");
        userDTO.setFirstName("firstname");
        userDTO.setLastName("lastname");
        userDTO.setEmail("save-account@example.com");
        userDTO.setActivated(false);
        userDTO.setImageUrl("http://placehold.it/50x50");
        userDTO.setLangKey(Constants.DEFAULT_LANGUAGE);
        userDTO.setAuthorities(Collections.singleton(AuthoritiesConstants.ADMIN));

        restAccountMockMvc.perform(
                post("/api/account")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userDTO)))
            .andExpect(status().isOk());

        User updatedUser = userRepository.findOneWithAuthoritiesByLogin(user.getLogin()).orElse(null);
        assertThat(updatedUser.getFirstName()).isEqualTo(userDTO.getFirstName());
        assertThat(updatedUser.getLastName()).isEqualTo(userDTO.getLastName());
        assertThat(updatedUser.getEmail()).isEqualTo(userDTO.getEmail());
        assertThat(updatedUser.getLangKey()).isEqualTo(userDTO.getLangKey());
        assertThat(updatedUser.getPassword()).isEqualTo(user.getPassword());
        assertThat(updatedUser.getImageUrl()).isEqualTo(userDTO.getImageUrl());
        assertThat(updatedUser.getActivated()).isEqualTo(false);
        assertThat(updatedUser.getAuthorities()).extracting("name").containsExactly(AuthoritiesConstants.ADMIN);
    }

    @Test
    @Transactional
    @WithMockUser("save-invalid-email")
    public void testSaveInvalidEmail() throws Exception {
        User user = new User();
        user.setLogin("save-invalid-email");
        user.setEmail("save-invalid-email@example.com");
        user.setPassword(RandomStringUtils.random(60));
        user.setActivated(true);

        userRepository.saveAndFlush(user);

        UserDTO userDTO = new UserDTO();
        userDTO.setLogin("not-used");
        userDTO.setFirstName("firstname");
        userDTO.setLastName("lastname");
        userDTO.setEmail("invalid email");
        userDTO.setActivated(false);
        userDTO.setImageUrl("http://placehold.it/50x50");
        userDTO.setLangKey(Constants.DEFAULT_LANGUAGE);
        userDTO.setAuthorities(Collections.singleton(AuthoritiesConstants.ADMIN));

        restAccountMockMvc.perform(
                post("/api/account")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userDTO)))
            .andExpect(status().isBadRequest());

        assertThat(userRepository.findOneWithAuthoritiesByEmailIgnoreCase("invalid email")).isNotPresent();
    }

    @Test
    @Transactional
    @WithMockUser("save-existing-email")
    public void testSaveExistingEmail() throws Exception {
        User user = new User();
        user.setLogin("save-existing-email");
        user.setEmail("save-existing-email@example.com");
        user.setPassword(RandomStringUtils.random(60));
        user.setActivated(true);
        userRepository.saveAndFlush(user);

        User anotherUser = new User();
        anotherUser.setLogin("save-existing-email2");
        anotherUser.setEmail("save-existing-email2@example.com");
        anotherUser.setPassword(RandomStringUtils.random(60));
        anotherUser.setActivated(true);

        userRepository.saveAndFlush(anotherUser);

        UserDTO userDTO = new UserDTO();
        userDTO.setLogin("not-used");
        userDTO.setFirstName("firstname");
        userDTO.setLastName("lastname");
        userDTO.setEmail("save-existing-email2@example.com");
        userDTO.setActivated(false);
        userDTO.setImageUrl("http://placehold.it/50x50");
        userDTO.setLangKey(Constants.DEFAULT_LANGUAGE);
        userDTO.setAuthorities(Collections.singleton(AuthoritiesConstants.ADMIN));

        restAccountMockMvc.perform(
                post("/api/account")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userDTO)))
            .andExpect(status().isBadRequest());

        User updatedUser = userRepository.findOneWithAuthoritiesByLogin("save-existing-email").orElse(null);
        assertThat(updatedUser.getEmail()).isEqualTo("save-existing-email@example.com");
    }

    @Test
    @Transactional
    @WithMockUser("save-existing-email-and-login")
    public void testSaveExistingEmailAndLogin() throws Exception {
        User user = new User();
        user.setLogin("save-existing-email-and-login");
        user.setEmail("save-existing-email-and-login@example.com");
        user.setPassword(RandomStringUtils.random(60));
        user.setActivated(true);
        userRepository.saveAndFlush(user);
        User savedUser = userRepository.findById(user.getId()).get();

        UserDTO userDTO = new UserDTO();
        userDTO.setId(savedUser.getId());
        userDTO.setLogin("not-used");
        userDTO.setFirstName("firstname");
        userDTO.setLastName("lastname");
        userDTO.setEmail("save-existing-email-and-login@example.com");
        userDTO.setActivated(false);
        userDTO.setImageUrl("http://placehold.it/50x50");
        userDTO.setLangKey(Constants.DEFAULT_LANGUAGE);
        userDTO.setAuthorities(Collections.singleton(AuthoritiesConstants.ADMIN));

        restAccountMockMvc.perform(
                post("/api/account")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userDTO)))
            .andExpect(status().isOk());

        // User updatedUser = userRepository.findOneWithAuthoritiesByLogin("save-existing-email-and-login").orElse(null);
        // assertThat(updatedUser.getEmail()).isEqualTo("save-existing-email-and-login@example.com");
    }

    @Test
    @Transactional
    @WithMockUser("change-password-wrong-existing-password")
    public void testChangePasswordWrongExistingPassword() throws Exception {
        User user = new User();
        String currentPassword = RandomStringUtils.random(60);
        user.setPassword(passwordEncoder.encode(currentPassword));
        user.setLogin("change-password-wrong-existing-password");
        user.setEmail("change-password-wrong-existing-password@example.com");
        userRepository.saveAndFlush(user);

        restAccountMockMvc.perform(post("/api/account/change-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content(TestUtil.convertObjectToJsonBytes(new PasswordChangeDTO("1" + currentPassword, "new password")))
            )
            .andExpect(status().isBadRequest());

        User updatedUser = userRepository.findOneWithAuthoritiesByLogin("change-password-wrong-existing-password").orElse(null);
        assertThat(passwordEncoder.matches("new password", updatedUser.getPassword())).isFalse();
        assertThat(passwordEncoder.matches(currentPassword, updatedUser.getPassword())).isTrue();
    }

    @Test
    @Transactional
    @WithMockUser("change-password")
    public void testChangePassword() throws Exception {
        User user = new User();
        String currentPassword = RandomStringUtils.random(60);
        user.setPassword(passwordEncoder.encode(currentPassword));
        user.setLogin("change-password");
        user.setEmail("change-password@example.com");
        userRepository.saveAndFlush(user);

        restAccountMockMvc.perform(post("/api/account/change-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content(TestUtil.convertObjectToJsonBytes(new PasswordChangeDTO(currentPassword, "new password")))
            )
            .andExpect(status().isOk());

        User updatedUser = userRepository.findOneWithAuthoritiesByLogin("change-password").orElse(null);
        assertThat(passwordEncoder.matches("new password", updatedUser.getPassword())).isTrue();
    }

    @Test
    @Transactional
    @WithMockUser("change-password-too-small")
    public void testChangePasswordTooSmall() throws Exception {
        User user = new User();
        String currentPassword = RandomStringUtils.random(60);
        user.setPassword(passwordEncoder.encode(currentPassword));
        user.setLogin("change-password-too-small");
        user.setEmail("change-password-too-small@example.com");
        userRepository.saveAndFlush(user);

        String newPassword = RandomStringUtils.random(ManagedUserVM.PASSWORD_MIN_LENGTH - 1);

        restAccountMockMvc.perform(post("/api/account/change-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content(TestUtil.convertObjectToJsonBytes(new PasswordChangeDTO(currentPassword, newPassword)))
            )
            .andExpect(status().isBadRequest());

        User updatedUser = userRepository.findOneWithAuthoritiesByLogin("change-password-too-small").orElse(null);
        assertThat(updatedUser.getPassword()).isEqualTo(user.getPassword());
    }

    @Test
    @Transactional
    @WithMockUser("change-password-too-long")
    public void testChangePasswordTooLong() throws Exception {
        User user = new User();
        String currentPassword = RandomStringUtils.random(60);
        user.setPassword(passwordEncoder.encode(currentPassword));
        user.setLogin("change-password-too-long");
        user.setEmail("change-password-too-long@example.com");
        userRepository.saveAndFlush(user);

        String newPassword = RandomStringUtils.random(ManagedUserVM.PASSWORD_MAX_LENGTH + 1);

        restAccountMockMvc.perform(post("/api/account/change-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content(TestUtil.convertObjectToJsonBytes(new PasswordChangeDTO(currentPassword, newPassword)))
            )
            .andExpect(status().isBadRequest());

        User updatedUser = userRepository.findOneWithAuthoritiesByLogin("change-password-too-long").orElse(null);
        assertThat(updatedUser.getPassword()).isEqualTo(user.getPassword());
    }

    @Test
    @Transactional
    @WithMockUser("change-password-empty")
    public void testChangePasswordEmpty() throws Exception {
        User user = new User();
        String currentPassword = RandomStringUtils.random(60);
        user.setPassword(passwordEncoder.encode(currentPassword));
        user.setLogin("change-password-empty");
        user.setEmail("change-password-empty@example.com");
        userRepository.saveAndFlush(user);

        restAccountMockMvc.perform(post("/api/account/change-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content(TestUtil.convertObjectToJsonBytes(new PasswordChangeDTO(currentPassword, "")))
            )
            .andExpect(status().isBadRequest());

        User updatedUser = userRepository.findOneWithAuthoritiesByLogin("change-password-empty").orElse(null);
        assertThat(updatedUser.getPassword()).isEqualTo(user.getPassword());
    }

    @Test
    @Transactional
    public void testRequestPasswordReset() throws Exception {
        User user = new User();
        user.setPassword(RandomStringUtils.random(60));
        user.setActivated(true);
        user.setLogin("password-reset");
        user.setEmail("password-reset@example.com");
        userRepository.saveAndFlush(user);

        restAccountMockMvc.perform(post("/api/account/reset-password/init")
                .content("password-reset@example.com")
                .header("g-recaptcha-response", Constants.TESTING_TOKEN))
            .andExpect(status().isOk());
    }

    @Test
    @Transactional
    public void testRequestPasswordResetUpperCaseEmail() throws Exception {
        User user = new User();
        user.setPassword(RandomStringUtils.random(60));
        user.setActivated(true);
        user.setLogin("password-reset-upper-case");
        user.setEmail("password-reset-upper-case@example.com");
        userRepository.saveAndFlush(user);

        restAccountMockMvc.perform(post("/api/account/reset-password/init")
                .content("password-reset-upper-case@EXAMPLE.COM")
                .header("g-recaptcha-response", Constants.TESTING_TOKEN))
            .andExpect(status().isOk());
    }

    @Test
    public void testRequestPasswordResetWrongEmail() throws Exception {
        restAccountMockMvc.perform(
                post("/api/account/reset-password/init")
                    .content("password-reset-wrong-email@example.com")
                    .header("g-recaptcha-response", Constants.TESTING_TOKEN))
            .andExpect(status().isOk());
    }

    @Test
    @Transactional
    public void testFinishPasswordReset() throws Exception {
        User user = new User();
        user.setPassword(RandomStringUtils.random(60));
        user.setLogin("finish-password-reset");
        user.setEmail("finish-password-reset@example.com");
        user.setResetDate(Instant.now().plusSeconds(60));
        user.setResetKey("reset key");
        userRepository.saveAndFlush(user);

        KeyAndPasswordVM keyAndPassword = new KeyAndPasswordVM();
        keyAndPassword.setKey(user.getResetKey());
        keyAndPassword.setNewPassword("new password");

        restAccountMockMvc.perform(
                post("/api/account/reset-password/finish")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(keyAndPassword)))
            .andExpect(status().isOk());

        User updatedUser = userRepository.findOneWithAuthoritiesByLogin(user.getLogin()).orElse(null);
        assertThat(passwordEncoder.matches(keyAndPassword.getNewPassword(), updatedUser.getPassword())).isTrue();
    }

    @Test
    @Transactional
    public void testFinishPasswordResetTooSmall() throws Exception {
        User user = new User();
        user.setPassword(RandomStringUtils.random(60));
        user.setLogin("finish-password-reset-too-small");
        user.setEmail("finish-password-reset-too-small@example.com");
        user.setResetDate(Instant.now().plusSeconds(60));
        user.setResetKey("reset key too small");
        userRepository.saveAndFlush(user);

        KeyAndPasswordVM keyAndPassword = new KeyAndPasswordVM();
        keyAndPassword.setKey(user.getResetKey());
        keyAndPassword.setNewPassword("foo");

        restAccountMockMvc.perform(
                post("/api/account/reset-password/finish")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(keyAndPassword)))
            .andExpect(status().isBadRequest());

        User updatedUser = userRepository.findOneWithAuthoritiesByLogin(user.getLogin()).orElse(null);
        assertThat(passwordEncoder.matches(keyAndPassword.getNewPassword(), updatedUser.getPassword())).isFalse();
    }

    @Test
    @Transactional
    public void testFinishPasswordResetWrongKey() throws Exception {
        KeyAndPasswordVM keyAndPassword = new KeyAndPasswordVM();
        keyAndPassword.setKey("wrong reset key");
        keyAndPassword.setNewPassword("new password");

        restAccountMockMvc.perform(
                post("/api/account/reset-password/finish")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(keyAndPassword)))
            .andExpect(status().isInternalServerError());
    }
}
