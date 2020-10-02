package org.mskcc.cbio.oncokb.web.rest;

import org.mskcc.cbio.oncokb.RedisTestContainerExtension;
import org.mskcc.cbio.oncokb.OncokbPublicApp;
import org.mskcc.cbio.oncokb.domain.Token;
import org.mskcc.cbio.oncokb.repository.TokenRepository;
import org.mskcc.cbio.oncokb.service.TokenService;

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
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link TokenResource} REST controller.
 */
@SpringBootTest(classes = OncokbPublicApp.class)
@ExtendWith({ RedisTestContainerExtension.class, MockitoExtension.class })
@AutoConfigureMockMvc
@WithMockUser
public class TokenResourceIT {

    private static final UUID DEFAULT_TOKEN = UUID.randomUUID();
    private static final UUID UPDATED_TOKEN = UUID.randomUUID();

    private static final Instant DEFAULT_CREATION = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CREATION = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_EXPIRATION = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_EXPIRATION = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Integer DEFAULT_USAGE_LIMIT = 1;
    private static final Integer UPDATED_USAGE_LIMIT = 2;

    private static final Integer DEFAULT_CURRENT_USAGE = 1;
    private static final Integer UPDATED_CURRENT_USAGE = 2;

    private static final Boolean DEFAULT_RENEWABLE = false;
    private static final Boolean UPDATED_RENEWABLE = true;

    @Autowired
    private TokenRepository tokenRepository;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTokenMockMvc;

    private Token token;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Token createEntity(EntityManager em) {
        Token token = new Token()
            .token(DEFAULT_TOKEN)
            .creation(DEFAULT_CREATION)
            .expiration(DEFAULT_EXPIRATION)
            .usageLimit(DEFAULT_USAGE_LIMIT)
            .currentUsage(DEFAULT_CURRENT_USAGE)
            .renewable(DEFAULT_RENEWABLE);
        return token;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Token createUpdatedEntity(EntityManager em) {
        Token token = new Token()
            .token(UPDATED_TOKEN)
            .creation(UPDATED_CREATION)
            .expiration(UPDATED_EXPIRATION)
            .usageLimit(UPDATED_USAGE_LIMIT)
            .currentUsage(UPDATED_CURRENT_USAGE)
            .renewable(UPDATED_RENEWABLE);
        return token;
    }

    @BeforeEach
    public void initTest() {
        token = createEntity(em);
    }

    @Test
    @Transactional
    public void createToken() throws Exception {
        int databaseSizeBeforeCreate = tokenRepository.findAll().size();

        // Create the Token
        restTokenMockMvc.perform(post("/api/tokens")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(token)))
            .andExpect(status().isCreated());

        // Validate the Token in the database
        List<Token> tokenList = tokenRepository.findAll();
        assertThat(tokenList).hasSize(databaseSizeBeforeCreate + 1);
        Token testToken = tokenList.get(tokenList.size() - 1);
        assertThat(testToken.getToken()).isEqualTo(DEFAULT_TOKEN);
        assertThat(testToken.getCreation()).isEqualTo(DEFAULT_CREATION);
        assertThat(testToken.getExpiration()).isEqualTo(DEFAULT_EXPIRATION);
        assertThat(testToken.getUsageLimit()).isEqualTo(DEFAULT_USAGE_LIMIT);
        assertThat(testToken.getCurrentUsage()).isEqualTo(DEFAULT_CURRENT_USAGE);
        assertThat(testToken.isRenewable()).isEqualTo(DEFAULT_RENEWABLE);
    }

    @Test
    @Transactional
    public void createTokenWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = tokenRepository.findAll().size();

        // Create the Token with an existing ID
        token.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restTokenMockMvc.perform(post("/api/tokens")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(token)))
            .andExpect(status().isBadRequest());

        // Validate the Token in the database
        List<Token> tokenList = tokenRepository.findAll();
        assertThat(tokenList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkCurrentUsageIsRequired() throws Exception {
        int databaseSizeBeforeTest = tokenRepository.findAll().size();
        // set the field null
        token.setCurrentUsage(null);

        // Create the Token, which fails.

        restTokenMockMvc.perform(post("/api/tokens")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(token)))
            .andExpect(status().isBadRequest());

        List<Token> tokenList = tokenRepository.findAll();
        assertThat(tokenList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkRenewableIsRequired() throws Exception {
        int databaseSizeBeforeTest = tokenRepository.findAll().size();
        // set the field null
        token.setRenewable(null);

        // Create the Token, which fails.

        restTokenMockMvc.perform(post("/api/tokens")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(token)))
            .andExpect(status().isBadRequest());

        List<Token> tokenList = tokenRepository.findAll();
        assertThat(tokenList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllTokens() throws Exception {
        // Initialize the database
        tokenRepository.saveAndFlush(token);

        // Get all the tokenList
        restTokenMockMvc.perform(get("/api/tokens?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(token.getId().intValue())))
            .andExpect(jsonPath("$.[*].token").value(hasItem(DEFAULT_TOKEN.toString())))
            .andExpect(jsonPath("$.[*].creation").value(hasItem(DEFAULT_CREATION.toString())))
            .andExpect(jsonPath("$.[*].expiration").value(hasItem(DEFAULT_EXPIRATION.toString())))
            .andExpect(jsonPath("$.[*].usageLimit").value(hasItem(DEFAULT_USAGE_LIMIT)))
            .andExpect(jsonPath("$.[*].currentUsage").value(hasItem(DEFAULT_CURRENT_USAGE)))
            .andExpect(jsonPath("$.[*].renewable").value(hasItem(DEFAULT_RENEWABLE.booleanValue())));
    }
    
    @Test
    @Transactional
    public void getToken() throws Exception {
        // Initialize the database
        tokenRepository.saveAndFlush(token);

        // Get the token
        restTokenMockMvc.perform(get("/api/tokens/{id}", token.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(token.getId().intValue()))
            .andExpect(jsonPath("$.token").value(DEFAULT_TOKEN.toString()))
            .andExpect(jsonPath("$.creation").value(DEFAULT_CREATION.toString()))
            .andExpect(jsonPath("$.expiration").value(DEFAULT_EXPIRATION.toString()))
            .andExpect(jsonPath("$.usageLimit").value(DEFAULT_USAGE_LIMIT))
            .andExpect(jsonPath("$.currentUsage").value(DEFAULT_CURRENT_USAGE))
            .andExpect(jsonPath("$.renewable").value(DEFAULT_RENEWABLE.booleanValue()));
    }

    @Test
    @Transactional
    public void getNonExistingToken() throws Exception {
        // Get the token
        restTokenMockMvc.perform(get("/api/tokens/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateToken() throws Exception {
        // Initialize the database
        tokenService.save(token);

        int databaseSizeBeforeUpdate = tokenRepository.findAll().size();

        // Update the token
        Token updatedToken = tokenRepository.findById(token.getId()).get();
        // Disconnect from session so that the updates on updatedToken are not directly saved in db
        em.detach(updatedToken);
        updatedToken
            .token(UPDATED_TOKEN)
            .creation(UPDATED_CREATION)
            .expiration(UPDATED_EXPIRATION)
            .usageLimit(UPDATED_USAGE_LIMIT)
            .currentUsage(UPDATED_CURRENT_USAGE)
            .renewable(UPDATED_RENEWABLE);

        restTokenMockMvc.perform(put("/api/tokens")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedToken)))
            .andExpect(status().isOk());

        // Validate the Token in the database
        List<Token> tokenList = tokenRepository.findAll();
        assertThat(tokenList).hasSize(databaseSizeBeforeUpdate);
        Token testToken = tokenList.get(tokenList.size() - 1);
        assertThat(testToken.getToken()).isEqualTo(UPDATED_TOKEN);
        assertThat(testToken.getCreation()).isEqualTo(UPDATED_CREATION);
        assertThat(testToken.getExpiration()).isEqualTo(UPDATED_EXPIRATION);
        assertThat(testToken.getUsageLimit()).isEqualTo(UPDATED_USAGE_LIMIT);
        assertThat(testToken.getCurrentUsage()).isEqualTo(UPDATED_CURRENT_USAGE);
        assertThat(testToken.isRenewable()).isEqualTo(UPDATED_RENEWABLE);
    }

    @Test
    @Transactional
    public void updateNonExistingToken() throws Exception {
        int databaseSizeBeforeUpdate = tokenRepository.findAll().size();

        // Create the Token

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTokenMockMvc.perform(put("/api/tokens")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(token)))
            .andExpect(status().isBadRequest());

        // Validate the Token in the database
        List<Token> tokenList = tokenRepository.findAll();
        assertThat(tokenList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteToken() throws Exception {
        // Initialize the database
        tokenService.save(token);

        int databaseSizeBeforeDelete = tokenRepository.findAll().size();

        // Delete the token
        restTokenMockMvc.perform(delete("/api/tokens/{id}", token.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Token> tokenList = tokenRepository.findAll();
        assertThat(tokenList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
