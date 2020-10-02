package org.mskcc.cbio.oncokb.web.rest;

import org.mskcc.cbio.oncokb.RedisTestContainerExtension;
import org.mskcc.cbio.oncokb.OncokbPublicApp;
import org.mskcc.cbio.oncokb.domain.TokenStats;
import org.mskcc.cbio.oncokb.repository.TokenStatsRepository;
import org.mskcc.cbio.oncokb.service.TokenStatsService;
import org.mskcc.cbio.oncokb.web.rest.errors.ExceptionTranslator;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

import static org.mskcc.cbio.oncokb.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link TokenStatsResource} REST controller.
 */
@SpringBootTest(classes = OncokbPublicApp.class)
@ExtendWith(RedisTestContainerExtension.class)
public class TokenStatsResourceIT {

    private static final String DEFAULT_ACCESS_IP = "AAAAAAAAAA";
    private static final String UPDATED_ACCESS_IP = "BBBBBBBBBB";

    private static final String DEFAULT_RESOURCE = "AAAAAAAAAA";
    private static final String UPDATED_RESOURCE = "BBBBBBBBBB";

    private static final Instant DEFAULT_ACCESS_TIME = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_ACCESS_TIME = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Integer DEFAULT_USAGE_COUNT = 1;
    private static final Integer UPDATED_USAGE_COUNT = 2;

    @Autowired
    private TokenStatsRepository tokenStatsRepository;

    @Autowired
    private TokenStatsService tokenStatsService;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    @Autowired
    private Validator validator;

    private MockMvc restTokenStatsMockMvc;

    private TokenStats tokenStats;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final TokenStatsResource tokenStatsResource = new TokenStatsResource(tokenStatsService);
        this.restTokenStatsMockMvc = MockMvcBuilders.standaloneSetup(tokenStatsResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter)
            .setValidator(validator).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TokenStats createEntity(EntityManager em) {
        TokenStats tokenStats = new TokenStats()
            .accessIp(DEFAULT_ACCESS_IP)
            .resource(DEFAULT_RESOURCE)
            .accessTime(DEFAULT_ACCESS_TIME)
            .usageCount(DEFAULT_USAGE_COUNT);
        return tokenStats;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TokenStats createUpdatedEntity(EntityManager em) {
        TokenStats tokenStats = new TokenStats()
            .accessIp(UPDATED_ACCESS_IP)
            .resource(UPDATED_RESOURCE)
            .accessTime(UPDATED_ACCESS_TIME)
            .usageCount(UPDATED_USAGE_COUNT);
        return tokenStats;
    }

    @BeforeEach
    public void initTest() {
        tokenStats = createEntity(em);
    }

    @Test
    @Transactional
    public void createTokenStats() throws Exception {
        int databaseSizeBeforeCreate = tokenStatsRepository.findAll().size();

        // Create the TokenStats
        restTokenStatsMockMvc.perform(post("/api/token-stats")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(tokenStats)))
            .andExpect(status().isCreated());

        // Validate the TokenStats in the database
        List<TokenStats> tokenStatsList = tokenStatsRepository.findAll();
        assertThat(tokenStatsList).hasSize(databaseSizeBeforeCreate + 1);
        TokenStats testTokenStats = tokenStatsList.get(tokenStatsList.size() - 1);
        assertThat(testTokenStats.getAccessIp()).isEqualTo(DEFAULT_ACCESS_IP);
        assertThat(testTokenStats.getResource()).isEqualTo(DEFAULT_RESOURCE);
        assertThat(testTokenStats.getAccessTime()).isEqualTo(DEFAULT_ACCESS_TIME);
        assertThat(testTokenStats.getUsageCount()).isEqualTo(DEFAULT_USAGE_COUNT);
    }

    @Test
    @Transactional
    public void createTokenStatsWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = tokenStatsRepository.findAll().size();

        // Create the TokenStats with an existing ID
        tokenStats.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restTokenStatsMockMvc.perform(post("/api/token-stats")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(tokenStats)))
            .andExpect(status().isBadRequest());

        // Validate the TokenStats in the database
        List<TokenStats> tokenStatsList = tokenStatsRepository.findAll();
        assertThat(tokenStatsList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkAccessTimeIsRequired() throws Exception {
        int databaseSizeBeforeTest = tokenStatsRepository.findAll().size();
        // set the field null
        tokenStats.setAccessTime(null);

        // Create the TokenStats, which fails.

        restTokenStatsMockMvc.perform(post("/api/token-stats")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(tokenStats)))
            .andExpect(status().isBadRequest());

        List<TokenStats> tokenStatsList = tokenStatsRepository.findAll();
        assertThat(tokenStatsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkUsageCountIsRequired() throws Exception {
        int databaseSizeBeforeTest = tokenStatsRepository.findAll().size();
        // set the field null
        tokenStats.setUsageCount(null);

        // Create the TokenStats, which fails.

        restTokenStatsMockMvc.perform(post("/api/token-stats")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(tokenStats)))
            .andExpect(status().isBadRequest());

        List<TokenStats> tokenStatsList = tokenStatsRepository.findAll();
        assertThat(tokenStatsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllTokenStats() throws Exception {
        // Initialize the database
        tokenStatsRepository.saveAndFlush(tokenStats);

        // Get all the tokenStatsList
        restTokenStatsMockMvc.perform(get("/api/token-stats?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(tokenStats.getId().intValue())))
            .andExpect(jsonPath("$.[*].accessIp").value(hasItem(DEFAULT_ACCESS_IP)))
            .andExpect(jsonPath("$.[*].resource").value(hasItem(DEFAULT_RESOURCE)))
            .andExpect(jsonPath("$.[*].accessTime").value(hasItem(DEFAULT_ACCESS_TIME.toString())))
            .andExpect(jsonPath("$.[*].usageCount").value(hasItem(DEFAULT_USAGE_COUNT)));
    }
    
    @Test
    @Transactional
    public void getTokenStats() throws Exception {
        // Initialize the database
        tokenStatsRepository.saveAndFlush(tokenStats);

        // Get the tokenStats
        restTokenStatsMockMvc.perform(get("/api/token-stats/{id}", tokenStats.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(tokenStats.getId().intValue()))
            .andExpect(jsonPath("$.accessIp").value(DEFAULT_ACCESS_IP))
            .andExpect(jsonPath("$.resource").value(DEFAULT_RESOURCE))
            .andExpect(jsonPath("$.accessTime").value(DEFAULT_ACCESS_TIME.toString()))
            .andExpect(jsonPath("$.usageCount").value(DEFAULT_USAGE_COUNT));
    }

    @Test
    @Transactional
    public void getNonExistingTokenStats() throws Exception {
        // Get the tokenStats
        restTokenStatsMockMvc.perform(get("/api/token-stats/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateTokenStats() throws Exception {
        // Initialize the database
        tokenStatsService.save(tokenStats);

        int databaseSizeBeforeUpdate = tokenStatsRepository.findAll().size();

        // Update the tokenStats
        TokenStats updatedTokenStats = tokenStatsRepository.findById(tokenStats.getId()).get();
        // Disconnect from session so that the updates on updatedTokenStats are not directly saved in db
        em.detach(updatedTokenStats);
        updatedTokenStats
            .accessIp(UPDATED_ACCESS_IP)
            .resource(UPDATED_RESOURCE)
            .accessTime(UPDATED_ACCESS_TIME)
            .usageCount(UPDATED_USAGE_COUNT);

        restTokenStatsMockMvc.perform(put("/api/token-stats")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedTokenStats)))
            .andExpect(status().isOk());

        // Validate the TokenStats in the database
        List<TokenStats> tokenStatsList = tokenStatsRepository.findAll();
        assertThat(tokenStatsList).hasSize(databaseSizeBeforeUpdate);
        TokenStats testTokenStats = tokenStatsList.get(tokenStatsList.size() - 1);
        assertThat(testTokenStats.getAccessIp()).isEqualTo(UPDATED_ACCESS_IP);
        assertThat(testTokenStats.getResource()).isEqualTo(UPDATED_RESOURCE);
        assertThat(testTokenStats.getAccessTime()).isEqualTo(UPDATED_ACCESS_TIME);
        assertThat(testTokenStats.getUsageCount()).isEqualTo(UPDATED_USAGE_COUNT);
    }

    @Test
    @Transactional
    public void updateNonExistingTokenStats() throws Exception {
        int databaseSizeBeforeUpdate = tokenStatsRepository.findAll().size();

        // Create the TokenStats

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTokenStatsMockMvc.perform(put("/api/token-stats")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(tokenStats)))
            .andExpect(status().isBadRequest());

        // Validate the TokenStats in the database
        List<TokenStats> tokenStatsList = tokenStatsRepository.findAll();
        assertThat(tokenStatsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteTokenStats() throws Exception {
        // Initialize the database
        tokenStatsService.save(tokenStats);

        int databaseSizeBeforeDelete = tokenStatsRepository.findAll().size();

        // Delete the tokenStats
        restTokenStatsMockMvc.perform(delete("/api/token-stats/{id}", tokenStats.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<TokenStats> tokenStatsList = tokenStatsRepository.findAll();
        assertThat(tokenStatsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
