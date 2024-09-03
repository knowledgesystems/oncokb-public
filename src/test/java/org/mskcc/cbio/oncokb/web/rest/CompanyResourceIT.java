package org.mskcc.cbio.oncokb.web.rest;

import com.google.gson.Gson;
import org.mskcc.cbio.oncokb.RedisTestContainerExtension;
import org.mskcc.cbio.oncokb.OncokbPublicApp;
import org.mskcc.cbio.oncokb.domain.Company;
import org.mskcc.cbio.oncokb.repository.CompanyRepository;
import org.mskcc.cbio.oncokb.service.CompanyService;
import org.mskcc.cbio.oncokb.service.dto.CompanyDTO;
import org.mskcc.cbio.oncokb.service.dto.companyadditionalinfo.CompanyAdditionalInfoDTO;
import org.mskcc.cbio.oncokb.service.mapper.CompanyMapper;
import org.mskcc.cbio.oncokb.web.rest.vm.CompanyVM;
import org.mskcc.cbio.oncokb.security.AuthoritiesConstants;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import javax.persistence.EntityManager;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.mskcc.cbio.oncokb.domain.enumeration.CompanyType;
import org.mskcc.cbio.oncokb.domain.enumeration.LicenseType;
import org.mskcc.cbio.oncokb.domain.enumeration.LicenseModel;
import org.mskcc.cbio.oncokb.domain.enumeration.LicenseStatus;
/**
 * Integration tests for the {@link CompanyResource} REST controller.
 */
@SpringBootTest(classes = OncokbPublicApp.class)
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser(authorities = AuthoritiesConstants.ADMIN)
public class CompanyResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final CompanyType DEFAULT_COMPANY_TYPE = CompanyType.PARENT;
    private static final CompanyType UPDATED_COMPANY_TYPE = CompanyType.BRANCH;

    private static final LicenseType DEFAULT_LICENSE_TYPE = LicenseType.ACADEMIC;
    private static final LicenseType UPDATED_LICENSE_TYPE = LicenseType.COMMERCIAL;

    private static final LicenseModel DEFAULT_LICENSE_MODEL = LicenseModel.FULL;
    private static final LicenseModel UPDATED_LICENSE_MODEL = LicenseModel.LIMITED;

    private static final LicenseStatus DEFAULT_LICENSE_STATUS = LicenseStatus.TRIAL;
    private static final LicenseStatus UPDATED_LICENSE_STATUS = LicenseStatus.REGULAR;

    private static final String DEFAULT_BUSINESS_CONTACT = "AAAAAAAAAA";
    private static final String UPDATED_BUSINESS_CONTACT = "BBBBBBBBBB";

    private static final String DEFAULT_LEGAL_CONTACT = "AAAAAAAAAA";
    private static final String UPDATED_LEGAL_CONTACT = "BBBBBBBBBB";

    private static final String[] DEFAULT_COMPANY_DOMAIN_NAMES = new String[] {"oncokb.org"};

    private static final Set<String> DEFAULT_COMPANY_DOMAINS = new HashSet<>(Arrays.asList(DEFAULT_COMPANY_DOMAIN_NAMES));

    private static final String[] UPDATED_COMPANY_DOMAIN_NAMES = new String[] {"oncokb.org, mskcc.org"};

    private static final Set<String> UPDATED_COMPANY_DOMAINS = new HashSet<>(Arrays.asList(UPDATED_COMPANY_DOMAIN_NAMES));
    private static final CompanyAdditionalInfoDTO DEFAULT_ADDITIONAL_INFO = new CompanyAdditionalInfoDTO();
    private static final CompanyAdditionalInfoDTO UPDATED_ADDITIONAL_INFO = new CompanyAdditionalInfoDTO();

    @Autowired
    private CompanyRepository companyRepository;

    @Mock
    private CompanyRepository companyRepositoryMock;

    @Autowired
    private CompanyMapper companyMapper;

    @Mock
    private CompanyService companyServiceMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCompanyMockMvc;

    private Company company;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Company createEntity(EntityManager em) {
        Company company = new Company()
            .name(DEFAULT_NAME)
            .description(DEFAULT_DESCRIPTION)
            .companyType(DEFAULT_COMPANY_TYPE)
            .licenseType(DEFAULT_LICENSE_TYPE)
            .licenseModel(DEFAULT_LICENSE_MODEL)
            .licenseStatus(DEFAULT_LICENSE_STATUS)
            .businessContact(DEFAULT_BUSINESS_CONTACT)
            .legalContact(DEFAULT_LEGAL_CONTACT)
            .additionalInfo(new Gson().toJson(DEFAULT_ADDITIONAL_INFO));
        return company;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Company createUpdatedEntity(EntityManager em) {
        Company company = new Company()
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .companyType(UPDATED_COMPANY_TYPE)
            .licenseType(UPDATED_LICENSE_TYPE)
            .licenseModel(UPDATED_LICENSE_MODEL)
            .licenseStatus(UPDATED_LICENSE_STATUS)
            .businessContact(UPDATED_BUSINESS_CONTACT)
            .legalContact(UPDATED_LEGAL_CONTACT)
            .additionalInfo(new Gson().toJson(UPDATED_ADDITIONAL_INFO));
        return company;
    }

    @BeforeEach
    public void initTest() {
        company = createEntity(em);
    }

    @Test
    @Transactional
    public void createCompany() throws Exception {
        int databaseSizeBeforeCreate = companyRepository.findAll().size();

        // Create the companyDTO
        CompanyDTO companyDTO = companyMapper.toDto(company);
        companyDTO.setCompanyDomains(DEFAULT_COMPANY_DOMAINS);

        restCompanyMockMvc.perform(post("/api/companies")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(companyDTO)))
            .andExpect(status().isCreated());

        // Validate the Company in the database
        List<Company> companyList = companyRepository.findAll();
        assertThat(companyList).hasSize(databaseSizeBeforeCreate + 1);
        Company testCompany = companyList.get(companyList.size() - 1);
        assertThat(testCompany.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testCompany.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testCompany.getCompanyType()).isEqualTo(DEFAULT_COMPANY_TYPE);
        assertThat(testCompany.getLicenseType()).isEqualTo(DEFAULT_LICENSE_TYPE);
        assertThat(testCompany.getLicenseModel()).isEqualTo(DEFAULT_LICENSE_MODEL);
        assertThat(testCompany.getLicenseStatus()).isEqualTo(DEFAULT_LICENSE_STATUS);
        assertThat(testCompany.getBusinessContact()).isEqualTo(DEFAULT_BUSINESS_CONTACT);
        assertThat(testCompany.getLegalContact()).isEqualTo(DEFAULT_LEGAL_CONTACT);
        assertThat(testCompany.getCompanyDomains())
            .extracting(companyDomain -> companyDomain.getName())
            .containsExactlyInAnyOrderElementsOf(DEFAULT_COMPANY_DOMAINS);

    }

    @Test
    @Transactional
    public void createCompanyWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = companyRepository.findAll().size();

        // Create the Company with an existing ID
        company.setId(1L);
        CompanyDTO companyDTO = companyMapper.toDto(company);

        // An entity with an existing ID cannot be created, so this API call must fail
        restCompanyMockMvc.perform(post("/api/companies")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(companyDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Company in the database
        List<Company> companyList = companyRepository.findAll();
        assertThat(companyList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void createCompanyWithExistingName() throws Exception {
        // Initialize database
        CompanyDTO existingCompanyDTO = companyMapper.toDto(company);
        existingCompanyDTO.setCompanyDomains(DEFAULT_COMPANY_DOMAINS);
        Company existingCompany = companyMapper.toEntity(existingCompanyDTO);
        companyRepository.saveAndFlush(existingCompany);
        int databaseSizeBeforeCreate = companyRepository.findAll().size();

        // Create the Company with an existing name
        CompanyDTO companyDTO = new CompanyDTO();
        companyDTO.setName(DEFAULT_NAME); // this name is already used
        companyDTO.setDescription(DEFAULT_DESCRIPTION);
        companyDTO.setCompanyType(DEFAULT_COMPANY_TYPE);
        companyDTO.setLicenseType(DEFAULT_LICENSE_TYPE);
        companyDTO.setLicenseModel(DEFAULT_LICENSE_MODEL);
        companyDTO.setLicenseStatus(DEFAULT_LICENSE_STATUS);
        companyDTO.setBusinessContact(DEFAULT_BUSINESS_CONTACT);
        companyDTO.setLegalContact(DEFAULT_LEGAL_CONTACT);
        companyDTO.setCompanyDomains(DEFAULT_COMPANY_DOMAINS);

        // An entity with an existing name cannot be created, so this API call must fail
        restCompanyMockMvc.perform(post("/api/companies")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(companyDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Company in the database
        List<Company> companyList = companyRepository.findAll();
        assertThat(companyList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = companyRepository.findAll().size();
        // set the field null
        company.setName(null);

        // Create the Company, which fails.
        CompanyDTO companyDTO = companyMapper.toDto(company);


        restCompanyMockMvc.perform(post("/api/companies")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(companyDTO)))
            .andExpect(status().isBadRequest());

        List<Company> companyList = companyRepository.findAll();
        assertThat(companyList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkCompanyTypeIsRequired() throws Exception {
        int databaseSizeBeforeTest = companyRepository.findAll().size();
        // set the field null
        company.setCompanyType(null);

        // Create the Company, which fails.
        CompanyDTO companyDTO = companyMapper.toDto(company);


        restCompanyMockMvc.perform(post("/api/companies")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(companyDTO)))
            .andExpect(status().isBadRequest());

        List<Company> companyList = companyRepository.findAll();
        assertThat(companyList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkLicenseTypeIsRequired() throws Exception {
        int databaseSizeBeforeTest = companyRepository.findAll().size();
        // set the field null
        company.setLicenseType(null);

        // Create the Company, which fails.
        CompanyDTO companyDTO = companyMapper.toDto(company);


        restCompanyMockMvc.perform(post("/api/companies")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(companyDTO)))
            .andExpect(status().isBadRequest());

        List<Company> companyList = companyRepository.findAll();
        assertThat(companyList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkLicenseModelIsRequired() throws Exception {
        int databaseSizeBeforeTest = companyRepository.findAll().size();
        // set the field null
        company.setLicenseModel(null);

        // Create the Company, which fails.
        CompanyDTO companyDTO = companyMapper.toDto(company);


        restCompanyMockMvc.perform(post("/api/companies")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(companyDTO)))
            .andExpect(status().isBadRequest());

        List<Company> companyList = companyRepository.findAll();
        assertThat(companyList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkLicenseStatusIsRequired() throws Exception {
        int databaseSizeBeforeTest = companyRepository.findAll().size();
        // set the field null
        company.setLicenseStatus(null);

        // Create the Company, which fails.
        CompanyDTO companyDTO = companyMapper.toDto(company);


        restCompanyMockMvc.perform(post("/api/companies")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(companyDTO)))
            .andExpect(status().isBadRequest());

        List<Company> companyList = companyRepository.findAll();
        assertThat(companyList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkCompanyDomainIsNotEmpty() throws Exception {
        int databaseSizeBeforeTest = companyRepository.findAll().size();

        // Create the companyDTO with empty domain list
        CompanyDTO companyDTO = companyMapper.toDto(company);
        companyDTO.setCompanyDomains(new HashSet<String>());

        restCompanyMockMvc.perform(post("/api/companies")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(companyDTO)))
            .andExpect(status().isBadRequest());

        List<Company> companyList = companyRepository.findAll();
        assertThat(companyList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllCompanies() throws Exception {
        // Initialize the database
        companyRepository.saveAndFlush(company);

        // Get all the companyList
        restCompanyMockMvc.perform(get("/api/companies?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(company.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].companyType").value(hasItem(DEFAULT_COMPANY_TYPE.toString())))
            .andExpect(jsonPath("$.[*].licenseType").value(hasItem(DEFAULT_LICENSE_TYPE.toString())))
            .andExpect(jsonPath("$.[*].licenseModel").value(hasItem(DEFAULT_LICENSE_MODEL.toString())))
            .andExpect(jsonPath("$.[*].licenseStatus").value(hasItem(DEFAULT_LICENSE_STATUS.toString())))
            .andExpect(jsonPath("$.[*].businessContact").value(hasItem(DEFAULT_BUSINESS_CONTACT)))
            .andExpect(jsonPath("$.[*].legalContact").value(hasItem(DEFAULT_LEGAL_CONTACT)));
    }

    @Test
    @Transactional
    public void getCompany() throws Exception {
        // Initialize the database
        companyRepository.saveAndFlush(company);

        // Get the company
        restCompanyMockMvc.perform(get("/api/companies/{id}", company.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(company.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.companyType").value(DEFAULT_COMPANY_TYPE.toString()))
            .andExpect(jsonPath("$.licenseType").value(DEFAULT_LICENSE_TYPE.toString()))
            .andExpect(jsonPath("$.licenseModel").value(DEFAULT_LICENSE_MODEL.toString()))
            .andExpect(jsonPath("$.licenseStatus").value(DEFAULT_LICENSE_STATUS.toString()))
            .andExpect(jsonPath("$.businessContact").value(DEFAULT_BUSINESS_CONTACT))
            .andExpect(jsonPath("$.legalContact").value(DEFAULT_LEGAL_CONTACT));
    }

    @Test
    @Transactional
    public void getNonExistingCompany() throws Exception {
        // Get the company
        restCompanyMockMvc.perform(get("/api/companies/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateCompany() throws Exception {
        // Initialize the database
        companyRepository.saveAndFlush(company);

        int databaseSizeBeforeUpdate = companyRepository.findAll().size();

        // Update the company
        CompanyVM companyVM = new CompanyVM();
        companyVM.setId(company.getId());
        companyVM.setName(UPDATED_NAME);
        companyVM.setDescription(UPDATED_DESCRIPTION);
        companyVM.setCompanyType(UPDATED_COMPANY_TYPE);
        companyVM.setLicenseType(UPDATED_LICENSE_TYPE);
        companyVM.setLicenseModel(UPDATED_LICENSE_MODEL);
        companyVM.setLicenseStatus(UPDATED_LICENSE_STATUS);
        companyVM.setBusinessContact(UPDATED_BUSINESS_CONTACT);
        companyVM.setLegalContact(UPDATED_LEGAL_CONTACT);
        companyVM.setCompanyDomains(UPDATED_COMPANY_DOMAINS);
        companyVM.setCompanyUserEmails(new ArrayList<String>());

        restCompanyMockMvc.perform(put("/api/companies")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(companyVM)))
            .andExpect(status().isOk());

        // Validate the Company in the database
        List<Company> companyList = companyRepository.findAll();
        assertThat(companyList).hasSize(databaseSizeBeforeUpdate);
        Company testCompany = companyList.get(companyList.size() - 1);
        assertThat(testCompany.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testCompany.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testCompany.getCompanyType()).isEqualTo(UPDATED_COMPANY_TYPE);
        assertThat(testCompany.getLicenseType()).isEqualTo(UPDATED_LICENSE_TYPE);
        assertThat(testCompany.getLicenseModel()).isEqualTo(UPDATED_LICENSE_MODEL);
        assertThat(testCompany.getLicenseStatus()).isEqualTo(UPDATED_LICENSE_STATUS);
        assertThat(testCompany.getBusinessContact()).isEqualTo(UPDATED_BUSINESS_CONTACT);
        assertThat(testCompany.getLegalContact()).isEqualTo(UPDATED_LEGAL_CONTACT);
        assertThat(testCompany.getCompanyDomains())
            .extracting(companyDomain -> companyDomain.getName())
            .containsExactlyInAnyOrderElementsOf(UPDATED_COMPANY_DOMAINS);
    }

    @Test
    @Transactional
    public void updateCompanyWithExistingName() throws Exception {
        // Initialize the database
        companyRepository.saveAndFlush(company);
        Company otherCompany = createEntity(em);    // Create another company using the same name
        otherCompany.setName(UPDATED_NAME);
        companyRepository.saveAndFlush(otherCompany);
        int databaseSizeBeforeUpdate = companyRepository.findAll().size();

        // Update the company
        CompanyVM companyVM = new CompanyVM();
        companyVM.setId(company.getId());
        companyVM.setName(UPDATED_NAME);    // Name already exists for otherCompany
        companyVM.setDescription(UPDATED_DESCRIPTION);
        companyVM.setCompanyType(UPDATED_COMPANY_TYPE);
        companyVM.setLicenseType(UPDATED_LICENSE_TYPE);
        companyVM.setLicenseModel(UPDATED_LICENSE_MODEL);
        companyVM.setLicenseStatus(UPDATED_LICENSE_STATUS);
        companyVM.setBusinessContact(UPDATED_BUSINESS_CONTACT);
        companyVM.setLegalContact(UPDATED_LEGAL_CONTACT);
        companyVM.setCompanyDomains(UPDATED_COMPANY_DOMAINS);
        companyVM.setCompanyUserEmails(new ArrayList<String>());

        // Company name should be unqiue, so this API call should fail
        restCompanyMockMvc.perform(put("/api/companies")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(companyVM)))
            .andExpect(status().isBadRequest());

        // Validate the Company in the database
        List<Company> companyList = companyRepository.findAll();
        assertThat(companyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void updateNonExistingCompany() throws Exception {
        int databaseSizeBeforeUpdate = companyRepository.findAll().size();

        // Create the Company
        CompanyDTO companyDTO = companyMapper.toDto(company);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCompanyMockMvc.perform(put("/api/companies")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(companyDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Company in the database
        List<Company> companyList = companyRepository.findAll();
        assertThat(companyList).hasSize(databaseSizeBeforeUpdate);
    }
}
