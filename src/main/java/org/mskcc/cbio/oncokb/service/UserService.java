package org.mskcc.cbio.oncokb.service;

import com.google.gson.Gson;
import io.github.jhipster.config.JHipsterProperties;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.text.similarity.JaroWinklerSimilarity;
import org.mskcc.cbio.oncokb.config.Constants;
import org.mskcc.cbio.oncokb.config.cache.CacheNameResolver;
import org.mskcc.cbio.oncokb.domain.*;
import org.mskcc.cbio.oncokb.domain.enumeration.LicenseModel;
import org.mskcc.cbio.oncokb.domain.enumeration.LicenseStatus;
import org.mskcc.cbio.oncokb.domain.enumeration.LicenseType;
import org.mskcc.cbio.oncokb.domain.enumeration.TokenType;
import org.mskcc.cbio.oncokb.repository.AuthorityRepository;
import org.mskcc.cbio.oncokb.repository.CompanyDomainRepository;
import org.mskcc.cbio.oncokb.repository.CompanyRepository;
import org.mskcc.cbio.oncokb.repository.UserDetailsRepository;
import org.mskcc.cbio.oncokb.repository.UserRepository;
import org.mskcc.cbio.oncokb.security.AuthoritiesConstants;
import org.mskcc.cbio.oncokb.security.SecurityUtils;
import org.mskcc.cbio.oncokb.security.uuid.TokenProvider;
import org.mskcc.cbio.oncokb.service.dto.useradditionalinfo.*;
import org.mskcc.cbio.oncokb.service.dto.CompanyDTO;
import org.mskcc.cbio.oncokb.service.dto.UserDTO;
import org.mskcc.cbio.oncokb.service.mapper.UserMapper;
import org.mskcc.cbio.oncokb.service.mapper.CompanyMapper;
import org.mskcc.cbio.oncokb.util.StringUtil;
import org.mskcc.cbio.oncokb.web.rest.errors.LoginAlreadyUsedException;

import io.github.jhipster.security.RandomUtil;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.actuate.audit.AuditEvent;
import org.springframework.cache.CacheManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.cache.annotation.Cacheable;

import javax.validation.constraints.NotNull;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

import static org.mskcc.cbio.oncokb.config.Constants.*;
import static org.mskcc.cbio.oncokb.config.cache.UserCacheResolver.USERS_BY_EMAIL_CACHE;
import static org.mskcc.cbio.oncokb.config.cache.UserCacheResolver.USERS_BY_LOGIN_CACHE;
import static org.mskcc.cbio.oncokb.config.cache.UserCacheResolver.ALL_USERS_CACHE;

/**
 * Service class for managing users.
 */
@Service
@Transactional
public class UserService {

    private final Logger log = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;

    private final UserDetailsRepository userDetailsRepository;

    private final PasswordEncoder passwordEncoder;

    private final AuthorityRepository authorityRepository;

    private final CacheManager cacheManager;

    private final CacheNameResolver cacheNameResolver;

    private final JHipsterProperties jHipsterProperties;

    private final TokenService tokenService;

    private final TokenStatsService tokenStatsService;

    private final TokenProvider tokenProvider;

    private final SlackService slackService;

    private final UserDetailsService userDetailsService;

    private final MailService mailService;

    private final UserMailsService userMailsService;

    private final CompanyDomainRepository companyDomainRepository;

    private final CompanyRepository companyRepository;

    private final AuditEventService auditEventService;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private CompanyMapper companyMapper;

    public UserService(
        UserRepository userRepository,
        UserDetailsRepository userDetailsRepository,
        PasswordEncoder passwordEncoder,
        AuthorityRepository authorityRepository,
        JHipsterProperties jHipsterProperties,
        TokenService tokenService,
        TokenStatsService tokenStatsService,
        TokenProvider tokenProvider,
        CacheNameResolver cacheNameResolver,
        SlackService slackService,
        CacheManager cacheManager,
        UserDetailsService userDetailsService,
        MailService mailService,
        UserMailsService userMailsService,
        AuditEventService auditEventService,
        CompanyDomainRepository companyDomainRepository,
        CompanyRepository companyRepository) {
        this.userRepository = userRepository;
        this.userDetailsRepository = userDetailsRepository;
        this.passwordEncoder = passwordEncoder;
        this.authorityRepository = authorityRepository;
        this.jHipsterProperties = jHipsterProperties;
        this.tokenService = tokenService;
        this.tokenStatsService = tokenStatsService;
        this.tokenProvider = tokenProvider;
        this.cacheNameResolver = cacheNameResolver;
        this.cacheManager = cacheManager;
        this.slackService = slackService;
        this.userDetailsService = userDetailsService;
        this.mailService = mailService;
        this.userMailsService = userMailsService;
        this.auditEventService = auditEventService;
        this.companyDomainRepository = companyDomainRepository;
        this.companyRepository = companyRepository;
    }

    public Optional<User> activateRegistration(String key) {
        log.debug("Activating user for activation key {}", key);
        return getUserByActivationKey(key)
            .map(user -> {
                // we only set the activation key to null after verifying the email.
                // the account needs to be manually verified by the admin
                user.setActivationKey(null);
                this.clearUserCaches(user);
                log.debug("Activated user: {}", user);
                return userRepository.save(user);
            });
    }

    public void generateNewActivationKey(User user) {
        user.setActivationKey(RandomUtil.generateActivationKey());
        userRepository.save(user);
        this.clearUserCaches(user);
    }

    public Optional<User> getUserByActivationKey(String key) {
        return userRepository.findOneByActivationKey(key);
    }

    public Optional<User> getUserByLogin(String login) {
        return userRepository.findOneWithAuthoritiesByLogin(login.toLowerCase());
    }

    public Optional<User> completePasswordReset(String newPassword, String key) {
        log.debug("Reset user password for reset key {}", key);
        return userRepository.findOneByResetKey(key)
            .map(user -> {
                user.setPassword(passwordEncoder.encode(newPassword));
                user.setResetKey(null);
                user.setResetDate(null);
                this.clearUserCaches(user);
                return userRepository.save(user);
            });
    }

    public Optional<User> requestPasswordReset(String login) {
        return userRepository.findOneWithAuthoritiesByLogin(login)
            .map(user -> {
                user.setResetKey(RandomUtil.generateResetKey());
                user.setResetDate(Instant.now());
                this.clearUserCaches(user);
                return userRepository.save(user);
            });
    }

    public Optional<User> initiateTrialAccountActivation(String login) {
        Optional<User> userOptional = userRepository.findOneWithAuthoritiesByLogin(login);
        if (userOptional.isPresent()) {
            Optional<UserDetails> userDetails = userDetailsRepository.findOneByUser(userOptional.get());
            UserDetails ud = null;
            if (userDetails.isPresent()) {
                ud = userDetails.get();
            } else {
                ud = new UserDetails();
                ud.setUser(userOptional.get());
            }

            AdditionalInfoDTO additionalInfoDTO = null;
            if (userDetails.isPresent()) {
                additionalInfoDTO = new Gson().fromJson(ud.getAdditionalInfo(), AdditionalInfoDTO.class);
            }
            if (additionalInfoDTO == null) {
                additionalInfoDTO = new AdditionalInfoDTO();
            }
            if (additionalInfoDTO.getTrialAccount() == null) {
                additionalInfoDTO.setTrialAccount(initiateTrialAccountInfo());
            }
            ud.setAdditionalInfo(new Gson().toJson(additionalInfoDTO));

            userDetailsRepository.save(ud);
            return userOptional;
        } else {
            return Optional.empty();
        }
    }

    public Optional<UserDTO> finishTrialAccountActivation(String key) {
        Optional<UserDetails> userDetailsOptional = userDetailsRepository.findOneByTrialActivationKey(key);
        User user = userDetailsOptional.get().getUser();
        UserDTO userDTO = userMapper.userToUserDTO(userDetailsOptional.get().getUser());

        if (userHasValidTrialActivation(userDTO)) {
            String userKey = userDTO.getAdditionalInfo().getTrialAccount().getActivation().getKey();
            if (StringUtils.isNotEmpty(userKey) && userKey.equals(key)) {
                // Update user account to trial account
                approveUser(userDTO, true);

                // Reset the trial account info
                Optional<UserDetails> userDetails = userDetailsRepository.findOneByUser(user);
                TrialAccount trialAccount = userDTO.getAdditionalInfo().getTrialAccount();
                trialAccount.getActivation().setActivationDate(Instant.now());
                trialAccount.getActivation().setKey(null);
                trialAccount.getLicenseAgreement().setAcceptanceDate(Instant.now());
                userDTO.getAdditionalInfo().setTrialAccount(trialAccount);

                userDetails.get().setAdditionalInfo(new Gson().toJson(userDTO.getAdditionalInfo()));
                userDetailsRepository.save(userDetails.get());

                slackService.sendConfirmationOnUserAcceptsTrialAgreement(userDTO, Instant.now().plusSeconds(TRIAL_PERIOD_IN_DAYS * DAY_IN_SECONDS));
                return Optional.of(userDTO);
            }
        }
        return Optional.empty();
    }

    private TrialAccount initiateTrialAccountInfo() {
        TrialAccount trialAccount = new TrialAccount();
        Activation activation = new Activation();
        activation.setInitiationDate(Instant.now());
        activation.setInitiatedBy(SecurityUtils.getCurrentUserLogin().orElse(""));
        activation.setKey(RandomUtil.generateResetKey());
        trialAccount.setActivation(activation);

        LicenseAgreement licenseAgreement = new LicenseAgreement();
        licenseAgreement.setName("Trial License Agreement");
        licenseAgreement.setVersion("v1");
        trialAccount.setLicenseAgreement(licenseAgreement);
        return trialAccount;
    }

    public User registerUser(UserDTO userDTO, String password) {
        userRepository.findOneWithAuthoritiesByEmailIgnoreCase(userDTO.getEmail()).ifPresent(existingUser -> {
            throw new EmailAlreadyUsedException();
        });
        userRepository.findOneWithAuthoritiesByLogin(userDTO.getLogin().toLowerCase()).ifPresent(existingUser -> {
            throw new LoginAlreadyUsedException();
        });
        User newUser = new User();
        String encryptedPassword = passwordEncoder.encode(password);
        newUser.setLogin(userDTO.getLogin().toLowerCase());
        // new user gets initially a generated password
        newUser.setPassword(encryptedPassword);
        newUser.setFirstName(userDTO.getFirstName());
        newUser.setLastName(userDTO.getLastName());
        if (userDTO.getEmail() != null) {
            newUser.setEmail(userDTO.getEmail().toLowerCase());
        }
        newUser.setImageUrl(userDTO.getImageUrl());
        if (userDTO.getLangKey() == null) {
            newUser.setLangKey(Constants.DEFAULT_LANGUAGE); // default language
        } else {
            newUser.setLangKey(userDTO.getLangKey());
        }
        // new user is not active
        newUser.setActivated(false);
        // new user gets registration key
        newUser.setActivationKey(RandomUtil.generateActivationKey());
        Set<Authority> authorities = new HashSet<>();
        authorityRepository.findById(AuthoritiesConstants.USER).ifPresent(authorities::add);
        newUser.setAuthorities(authorities);
        userRepository.save(newUser);

        UserDetails userDetails = new UserDetails();
        userDetails.setUser(newUser);
        userDetails.setLicenseType(userDTO.getLicenseType());
        userDetails.setJobTitle(userDTO.getJobTitle());
        userDetails.setCompanyName(userDTO.getCompanyName());
        userDetails.setCity(userDTO.getCity());
        userDetails.setCountry(userDTO.getCountry());
        if (userDTO.getAdditionalInfo() != null) {
            userDetails.setAdditionalInfo(new Gson().toJson(userDTO.getAdditionalInfo()));
        }
        userDetailsRepository.save(userDetails);

        this.clearUserCaches(newUser);
        log.debug("Created Information for User: {}", newUser);
        return newUser;
    }

    public User createUser(UserDTO userDTO, boolean isServiceUser, Optional<Integer> tokenValidDays, Optional<Boolean> tokenIsRenewable) {
        User user = new User();
        user.setLogin(userDTO.getLogin().toLowerCase());
        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        if (userDTO.getEmail() != null) {
            user.setEmail(userDTO.getEmail().toLowerCase());
        }
        user.setImageUrl(userDTO.getImageUrl());
        if (userDTO.getLangKey() == null) {
            user.setLangKey(Constants.DEFAULT_LANGUAGE); // default language
        } else {
            user.setLangKey(userDTO.getLangKey());
        }
        String encryptedPassword = passwordEncoder.encode(RandomUtil.generatePassword());
        user.setPassword(encryptedPassword);
        user.setResetKey(RandomUtil.generateResetKey());
        user.setResetDate(Instant.now());
        user.setActivated(true);
        if (userDTO.getAuthorities() != null) {
            Set<Authority> authorities = userDTO.getAuthorities().stream()
                .map(authorityRepository::findById)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .collect(Collectors.toSet());
            user.setAuthorities(authorities);
        }
        User updatedUser = userRepository.save(user);

        UserDetails userDetails = new UserDetails();
        userDetails.setUser(user);
        userDetails.setLicenseType(userDTO.getLicenseType());
        userDetails.setJobTitle(userDTO.getJobTitle());
        userDetails.setCompanyName(userDTO.getCompanyName());
        userDetails.setCity(userDTO.getCity());
        userDetails.setCountry(userDTO.getCountry());
        if(userDTO.getAdditionalInfo() != null) {
            userDetails.setAdditionalInfo(new Gson().toJson(userDTO.getAdditionalInfo()));
        }
        userDetails.setCompany(companyMapper.toEntity(userDTO.getCompany()));
        userDetailsRepository.save(userDetails);

        if (isServiceUser) {
            log.debug("Created Information for Service User: {}", user);
            return user;
        }

        // Check if the user is a part of licensed company and then continue with approval procedure
        if(userDetails.getCompany() != null){
            companyRepository.findById(userDetails.getCompany().getId())
                .ifPresent(c -> {
                    updateUserWithCompanyLicense(userMapper.userToUserDTO(updatedUser), c, false, true);
                });
        }

        this.clearUserCaches(user);
        if(!tokenIsRenewable.isPresent() || tokenIsRenewable.get().equals(true)) {
            generateTokenForUserIfNotExist(userMapper.userToUserDTO(updatedUser), tokenValidDays, tokenIsRenewable);
        }
        log.debug("Created Information for User: {}", user);
        return user;
    }

    public Optional<UserDTO> updateUserFromUserDTO(UserDTO userDTO) {
        Optional<UserDTO> updatedUserDTO = Optional.of(userRepository
        .findById(userDTO.getId()))
        .filter(Optional::isPresent)
        .map(Optional::get)
        .map(user -> {
            this.clearUserCaches(user);
            user.setLogin(userDTO.getLogin().toLowerCase());
            user.setFirstName(userDTO.getFirstName());
            user.setLastName(userDTO.getLastName());
            if (userDTO.getEmail() != null) {
                user.setEmail(userDTO.getEmail().toLowerCase());
            }
            user.setImageUrl(userDTO.getImageUrl());
            user.setActivationKey(userDTO.getActivationKey());
            user.setResetKey(userDTO.getResetKey());
            user.setResetDate(userDTO.getResetDate());
            if (userDTO.isActivated() != user.getActivated()) {
                user.setActivated(userDTO.isActivated());
                user.setActivationKey(null);
                user.setResetKey(null);
                user.setResetDate(null);
            }
            user.setLangKey(userDTO.getLangKey());
            Set<Authority> managedAuthorities = user.getAuthorities();
            managedAuthorities.clear();
            userDTO.getAuthorities().stream()
                .map(authorityRepository::findById)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .forEach(managedAuthorities::add);
            this.clearUserCaches(user);
            log.debug("Changed Information for User: {}", user);
            UserDTO newUserDTO =  new UserDTO(user, getUpdatedUserDetails(
                user, userDTO.getLicenseType(), userDTO.getJobTitle(), userDTO.getCompanyName(), userDTO.getCompany(), new Gson().toJson(userDTO.getAdditionalInfo()), userDTO.getCity(), userDTO.getCountry()));
            newUserDTO.setCompany(userDTO.getCompany());
            return newUserDTO;
        });
        return updatedUserDTO;
    }

    /**
     * Update all information for a specific user, and return the modified user.
     *
     * @param userDTO user to update.
     * @return updated user.
     */
    public Optional<UserDTO> updateUserAndTokens(UserDTO userDTO) {
        Optional<UserDTO> updatedUserDTO = updateUserFromUserDTO(userDTO);

        if (updatedUserDTO.isPresent()) {
            if (updatedUserDTO.get().isActivated()) {
                List<Token> tokens = generateTokenForUserIfNotExist(updatedUserDTO.get(), Optional.empty(), Optional.empty());
                tokens.forEach(token -> {
                    if (token.getExpiration().isBefore(Instant.now())) {
                        token.setExpiration(Instant.now().plusSeconds(DEFAULT_TOKEN_EXPIRATION_IN_SECONDS));
                    }
                    tokenService.save(token);
                });
            } else {
                expireUserAccount(userDTO);
            }
        }
        return updatedUserDTO;
    }

    public Optional<UserDTO> updateUserBeforeTrialAccountActivation(UserDTO userDTO) {
        return updateUserFromUserDTO(userDTO);
    }

    private UserDetails getUpdatedUserDetails(User user, LicenseType licenseType, String jobTitle, String companyName, CompanyDTO companyDTO, String additionalInfo, String city, String country) {
        Optional<UserDetails> userDetails = userDetailsRepository.findOneByUser(user);
        LicenseType alignedLicenseType = companyDTO != null ? companyDTO.getLicenseType() : licenseType;
        Company company = companyMapper.toEntity(companyDTO);
        if (userDetails.isPresent()) {
            //If a user has an associated company, align their licenseStatus with the company's
            userDetails.get().setLicenseType(alignedLicenseType);
            userDetails.get().setJobTitle(jobTitle);
            userDetails.get().setCompany(company);
            userDetails.get().setCompanyName(companyName);
            userDetails.get().setAdditionalInfo(additionalInfo);
            userDetails.get().setCity(city);
            userDetails.get().setCountry(country);
            userDetailsRepository.save(userDetails.get());
            return userDetails.get();
        } else {
            UserDetails newUserDetails = new UserDetails();
            newUserDetails.setLicenseType(alignedLicenseType);
            newUserDetails.setJobTitle(jobTitle);
            newUserDetails.setCompanyName(companyName);
            newUserDetails.setCompany(company);
            newUserDetails.setAdditionalInfo(additionalInfo);
            newUserDetails.setCity(city);
            newUserDetails.setCountry(country);
            newUserDetails.setUser(user);
            userDetailsRepository.save(newUserDetails);
            return newUserDetails;
        }
    }

    public void deleteUser(String login) {
        userRepository.findOneWithAuthoritiesByLogin(login).ifPresent(user -> {
            // Delete all token stats
            List<Token> tokens = tokenService.findByUser(user);
            tokenStatsService.deleteAllByTokenIn(tokens);

            // Delete all tokens
            tokenService.deleteAllByUser(user);

            // Delete user details
            userDetailsService.deleteByUser(user);

            // Delete user mails
            userMailsService.deleteAllByUser(user);

            userRepository.delete(user);
            this.clearUserCaches(user);

            String deletedBy = SecurityUtils.getCurrentUserLogin().orElse("");
            Map<String, Object> eventData = new HashMap<>();
            eventData.put("userLogin", user.getLogin());
            eventData.put("deletedBy", deletedBy);
            AuditEvent event = new AuditEvent(Instant.now(), deletedBy, "USER_DELETION_SUCCESS", eventData);
            auditEventService.save(event);

            log.debug("Deleted User: {}", user);
        });
    }

    @Transactional
    public void changePassword(String currentClearTextPassword, String newPassword) {
        SecurityUtils.getCurrentUserLogin()
            .flatMap(userRepository::findOneWithAuthoritiesByLogin)
            .ifPresent(user -> {
                String currentEncryptedPassword = user.getPassword();
                if (!passwordEncoder.matches(currentClearTextPassword, currentEncryptedPassword)) {
                    throw new InvalidPasswordException();
                }
                String encryptedPassword = passwordEncoder.encode(newPassword);
                user.setPassword(encryptedPassword);
                this.clearUserCaches(user);
                log.debug("Changed password for User: {}", user);
                userRepository.save(user);
            });
    }

    @Transactional(readOnly = true)
    public List<UserDTO> findAllUsersWithUserDetailsByUsersIn(List<User> users) {
        List<Object[]> usersWithDetails = userRepository.findAllUsersWithUserDetailsByUsersIn(users);
        return usersWithDetails
            .stream()
            .map(u -> {
                User user = (User) u[0];
                UserDetails userDetails = (UserDetails) u[1];
                return userMapper.userToUserDTO(user, userDetails);
            })
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    @Cacheable(cacheResolver = "userCacheResolver", key = "#root.methodName")
    public Page<UserDTO> getAllManagedUsers(Pageable pageable) {
        List<User> users = userRepository.findAllUsersWithoutAuthorityAndLoginNot(AuthoritiesConstants.ROLE_SERVICE_ACCOUNT, Constants.ANONYMOUS_USER);
        List<UserDTO> userDTOs = findAllUsersWithUserDetailsByUsersIn(users);
        return new PageImpl<>(userDTOs, pageable, users.size());
    }

    @Transactional(readOnly = true)
    @Cacheable(cacheResolver = "userCacheResolver", key = "#root.methodName")
    public List<UserDTO> getAllManagedUsers() {
        final PageRequest pageable = PageRequest.of(0, (int) userRepository.count());
        return this.getAllManagedUsers(pageable).getContent();
    }

    @Transactional(readOnly = true)
    public Optional<User> getUserWithAuthoritiesByLogin(String login) {
        return userRepository.findOneWithAuthoritiesByLogin(login);
    }

    @Transactional(readOnly = true)
    public Optional<User> getUserWithAuthorities() {
        return SecurityUtils.getCurrentUserLogin().flatMap(userRepository::findOneWithAuthoritiesByLogin);
    }

    @Transactional(readOnly = true)
    public Optional<User> getUserWithAuthoritiesByEmailIgnoreCase(String email) {
        return userRepository.findOneWithAuthoritiesByEmailIgnoreCase(email);
    }

    @Transactional(readOnly = true)
    public Page<UserDTO> getAllRegisteredUsers(Pageable pageable) {
        return userRepository.findAllByActivatedIsTrueOrderByCreatedBy(pageable).map(user -> userMapper.userToUserDTO(user));
    }

    @Transactional(readOnly = true)
    public Optional<User> getUserById(Long id) {
        return userRepository.findOneById(id);
    }

    public Optional<UserDTO> approveUser(UserDTO userDTO, Boolean isTrial) {
        if (!userDTO.isActivated()) {
            userDTO.setActivated(true);
        }
        Optional<UserDTO> updatedUserDTO = updateUserAndTokens(userDTO);
        if (updatedUserDTO.isPresent()) {
            List<Token> tokens =
                generateTokenForUserIfNotExist(
                    updatedUserDTO.get(),
                    isTrial ? Optional.of(TRIAL_PERIOD_IN_DAYS) : Optional.empty(),
                    isTrial ? Optional.of(false) : Optional.empty()
                );
            if (isTrial) {
                tokens.forEach(token -> {
                    boolean wasRenewable = token.isRenewable();
                    Instant expirationDate = Instant.now().plusSeconds(DAY_IN_SECONDS * TRIAL_PERIOD_IN_DAYS);
                    if (!wasRenewable && token.getExpiration().isAfter(expirationDate)) {
                        // We have some users that have a longer trial period
                        // Use the default trial period (90 days) or the non-renewable token's period, whichever is longer
                        expirationDate = token.getExpiration();
                    }
                    token.setRenewable(false);
                    token.setExpiration(expirationDate);
                    tokenService.save(token);
                });
            }
        }
        return updatedUserDTO;
    }

    /**
     * Convert a user to a regular user. The user will be activated and their tokens will be converted
     * to renewable tokens.
     * @param userDTO
     */
    public void convertUserToRegular(UserDTO userDTO) {
        // Activate the user
        if (!userDTO.isActivated()) {
            userDTO.setActivated(true);
        }

        Optional<UserDTO> updatedUserDTO = updateUserAndTokens(userDTO);
        if (!updatedUserDTO.isPresent()) {
            return;
        }
        userDTO = updatedUserDTO.get();
        User user = userMapper.userDTOToUser(userDTO);

        // This is to prevent the user from having to agree to trial license agreement if they
        // are converted to a regular license before they activate their trial.
        if (userHasUnactivatedTrial(userDTO)) {
            clearTrialAccountInformation(userDTO);
        }

        // Update the user's tokens to renewable
        List<Token> tokens = tokenService.findByUser(user);
        tokens.forEach(token -> {
            token.setRenewable(true);
            token.setExpiration(Instant.now().plusSeconds(DEFAULT_TOKEN_EXPIRATION_IN_SECONDS));
            tokenService.save(token);
        });

    }

    private List<Token> generateTokenForUserIfNotExist(UserDTO userDTO, Optional<Integer> tokenValidDays, Optional<Boolean> tokenIsRenewable) {
        // automatically generate a token for user if not exists
        List<Token> tokens = tokenService.findByUser(userMapper.userDTOToUser(userDTO));
        if (tokens.isEmpty()) {
            Token token = tokenProvider.createToken(
                userMapper.userDTOToUser(userDTO),
                TokenType.USER,
                tokenValidDays.isPresent() ? Optional.of(Instant.now().plusSeconds(DAY_IN_SECONDS * (long) tokenValidDays.get())) : Optional.empty(),
                tokenIsRenewable,
                Optional.empty()
            );
            tokens.add(token);
        }
        return tokens;
    }

    public List<UserDTO> getAllActivatedUsersWithoutTokens() {
        return userRepository.findAllActivatedWithoutTokens().stream().map(user -> userMapper.userToUserDTO(user)).collect(Collectors.toList());
    }

    public List<UserMessagePair> getAllUnapprovedUsersCreatedAfter(int daysAgo) {
        List<UserIdMessagePair> idList = slackService.getAllUnapprovedUserRequestsSentAfter(daysAgo);
        List<UserMessagePair> userList = new ArrayList<>();
        for (UserIdMessagePair userIdMessagePair : idList) {
            userList.add(new UserMessagePair(userMapper.userToUserDTO(userRepository.findOneById(userIdMessagePair.getId()).get()), userIdMessagePair.getMessage()));
        }
        return userList;
    }

    public void removeNotActivatedUsers() {
        userRepository
            .findAllByActivatedIsFalseAndActivationKeyIsNotNullAndCreatedDateBefore(Instant.now().minus(jHipsterProperties.getAuditEvents().getRetentionPeriod(), ChronoUnit.DAYS))
            .forEach(user -> {
                log.debug("Deleting not activated user {}", user.getLogin());
                userRepository.delete(user);
                this.clearUserCaches(user);
            });
    }

    public boolean userHasAuthority(User user, String authority) {
        return user.getAuthorities().stream().filter(userAuth -> userAuth.getName().equalsIgnoreCase(authority)).count() > 0;
    }

    public List<UserDTO> getPotentialDuplicateAccountsByUser(UserDTO user) {
        return searchAccountsForPotentialDuplicateUser(user, getAllManagedUsers());
    }

    public List<UserDTO> searchAccountsForPotentialDuplicateUser(UserDTO user, List<UserDTO> allUsers) {
        JaroWinklerSimilarity jw = new JaroWinklerSimilarity();
        List<UserDTO> potentialDuplicateUsers = new ArrayList<>();
        for (UserDTO potentialDuplicate : allUsers) {
            if (user.getId().equals(potentialDuplicate.getId())) {
                continue;
            }

            Double similarity = jw.apply(user.getFirstName(), potentialDuplicate.getFirstName()) * .3 + jw.apply(user.getLastName(), potentialDuplicate.getLastName()) * .7;
            if (similarity > .87) {
                potentialDuplicateUsers.add(potentialDuplicate);
            }
        }
        return potentialDuplicateUsers;
    }

    /**
     * Gets a list of all the authorities.
     *
     * @return a list of all the authorities.
     */
    @Transactional(readOnly = true)
    public List<String> getAuthorities() {
        return authorityRepository.findAll().stream().map(Authority::getName).collect(Collectors.toList());
    }

    /**
     * Create a mapping between the user and the company and align
     * the user's license with their company's license.
     * @param userDTO the userDTO
     * @param company the company to update the user with
     * @param keepOriginalLicense allow a user to keep their regular license when added to trial company
     * @param isAccountCreation if the admin is creating the account
     */
    public Optional<UserDTO> updateUserWithCompanyLicense(UserDTO userDTO, Company company, boolean keepOriginalLicense, boolean isAccountCreation){
        // Map the user to the company
        userDTO.setCompanyName(company.getName());
        userDTO.setCompany(companyMapper.toDto(company));
        userDTO.setLicenseType(company.getLicenseType());
        Optional<UserDTO> updatedUserDTO = updateUserAndTokens(userDTO);

        if (updatedUserDTO.isPresent()) {
            // Update the user with the company's license
            LicenseStatus companyLicenseStatus = company.getLicenseStatus();
            if (companyLicenseStatus.equals(LicenseStatus.REGULAR)) {
                convertUserToRegular(userDTO);
            }else if (companyLicenseStatus.equals(LicenseStatus.TRIAL)) {
                // If the user is activated and allowed to keep their regular license
                // then we don't need to update their license, just add them to the company.
                if (keepOriginalLicense && userDTO.isActivated() && !isUserOnTrial(userDTO)) {
                    return updatedUserDTO;
                }
                if (userHasValidTrialActivation(userDTO)
                    && userDTO.getAdditionalInfo().getTrialAccount().getActivation().getActivationDate() != null){
                    // When a user has an active or expired trial, we just need to approve and update their tokens.
                    updatedUserDTO = approveUser(userDTO, true);
                } else {
                    Optional<User> updatedUser = initiateTrialAccountActivation(userDTO.getLogin());
                    if (updatedUser.isPresent()) {
                        updatedUser.get().setActivated(true);
                        if (!isAccountCreation) {
                            mailService.sendActiveTrialMail(userMapper.userToUserDTO(updatedUser.get()), false);
                        }
                        updatedUserDTO = updateUserAndTokens(userMapper.userToUserDTO(updatedUser.get()));
                    }
                }
            }else if (companyLicenseStatus.equals(LicenseStatus.TRIAL_EXPIRED) || companyLicenseStatus.equals(LicenseStatus.EXPIRED)) {
                expireUserAccount(userDTO);
            }
        }

        return updatedUserDTO;
    }

    /**
     * Deactivates the user and also expires all their tokens.
     * @param userDTO the userDTO
     */
    private void expireUserAccount(UserDTO userDTO) {
        if(userDTO.isActivated()) {
            userDTO.setActivated(false);
            updateUserAndTokens(userDTO);
        } else {
            if (userHasUnactivatedTrial(userDTO)) {
                clearTrialAccountInformation(userDTO);
            }
            List<Token> tokens = tokenService.findByUser(userMapper.userDTOToUser(userDTO));
            tokens.forEach(token -> {
                tokenService.expireToken(token);
            });
        }
    }

    /**
     * Clears the trial account information.
     * @param userDTO
     */
    private void clearTrialAccountInformation(UserDTO userDTO) {
            userDTO.getAdditionalInfo().setTrialAccount(null);
            Optional<UserDetails> userDetails = userDetailsRepository.findOneByUser(userMapper.userDTOToUser(userDTO));
            if (userDetails.isPresent()) {
                UserDetails ud = userDetails.get();
                userDTO.getAdditionalInfo().setTrialAccount(null);
                ud.setAdditionalInfo(new Gson().toJson(userDTO.getAdditionalInfo()));
                userDetailsRepository.save(ud);
            }
    }

    /**
     * Find a company based on the user's email address domain.
     * @param userDTO the user
     */
    @NotNull
    public CompanyCandidate findCompanyCandidate(UserDTO userDTO) {

        // Using the email domain, find a company, if possible.
        String emailDomain = StringUtil.getEmailDomain(userDTO.getEmail());
        Optional<CompanyDomain> optionalCompanyDomain = companyDomainRepository.findOneByNameIgnoreCase(emailDomain);
        if (optionalCompanyDomain.isPresent()) {
            Set<Company> companies = optionalCompanyDomain.get().getCompanies();
            if (companies.size() == 1) {
                Company company = companies.iterator().next();
                if (company.getLicenseModel().equals(LicenseModel.LIMITED)) {
                    return new CompanyCandidate(Optional.of(company), false);
                }
                if (company.getLicenseModel().equals(LicenseModel.FULL)) {
                    // If only a regular license model exists for domain, then auto approve user with company.
                    return new CompanyCandidate(Optional.of(company), true);
                }
            } else if (companies.size() > 1) {
                // If there are multiple companies with the domain, then we find a company with a regular license.
                Optional<Company> foundCompany = companies
                    .stream()
                    .filter(c -> {
                        return c.getLicenseModel().equals(LicenseModel.FULL);
                    })
                    .findAny();
                return new CompanyCandidate(foundCompany, true);
            }
        }

        return new CompanyCandidate(Optional.empty(), false);
    }

    /**
     * Checks whether the user has activated their trial license.
     * @param userDTO
     * @return true if the user has trial account activation information, otherwise false.
     */
    private boolean userHasValidTrialActivation(UserDTO userDTO){
        return Optional.ofNullable(userDTO)
            .map(UserDTO::getAdditionalInfo)
            .map(AdditionalInfoDTO::getTrialAccount)
            .map(TrialAccount::getActivation)
            .isPresent();
    }

    /**
     * Checks whether the user is currently on trial. A user is considered
     * to be on trial if they have no renewable token.
     * @param userDTO
     * @return true if user has no renewable token, otherwise false
     */
    public boolean isUserOnTrial(UserDTO userDTO) {
        return !tokenService.findByUser(userMapper.userDTOToUser(userDTO))
            .stream()
            .filter(token -> token.isRenewable())
            .findAny()
            .isPresent();
    }

    /**
     * Checks whether the user has initiated their trial, but has not activated it yet.
     * @param userDTO
     * @return true if the user activated their trial, otherwise false.
     */
    public boolean userHasUnactivatedTrial(UserDTO userDTO) {
        return Optional.ofNullable(userDTO)
            .map(UserDTO::getAdditionalInfo)
            .map(AdditionalInfoDTO::getTrialAccount)
            .map(TrialAccount::getActivation)
            .map(activation -> {
                return StringUtils.isNotEmpty(activation.getKey()) && activation.getActivationDate() == null;
            }).orElse(false);
    }

    public List<UserDTO> getCompanyUsers(Long companyId){
        List<UserDetails> userDetails = userDetailsRepository.findByCompanyId(companyId);
        List<User> users = userDetails
            .stream()
            .map(UserDetails::getUser)
            .collect(Collectors.toList());
        return userMapper.usersToUserDTOs(users);
    }

    public List<String> getNonCompanyUserEmails() {
        return userDetailsRepository.findUserEmailsByCompanyIdIsNull();
    }

    private void clearUserCaches(User user) {
        Objects.requireNonNull(cacheManager.getCache(this.cacheNameResolver.getCacheName(USERS_BY_LOGIN_CACHE))).evict(user.getLogin());
        if (user.getEmail() != null) {
            Objects.requireNonNull(cacheManager.getCache(this.cacheNameResolver.getCacheName(USERS_BY_EMAIL_CACHE))).evict(user.getEmail());
        }
        Objects.requireNonNull(cacheManager.getCache(this.cacheNameResolver.getCacheName(ALL_USERS_CACHE))).evict("getAllManagedUsers");;
    }

    public boolean isAdmin(String userLogin) {
        Optional<User> user = getUserByLogin(userLogin);
        return user.isPresent() && user.get().getAuthorities().stream().filter(authority -> authority.getName().equalsIgnoreCase(AuthoritiesConstants.ADMIN)).count() > 0;
    }
}
