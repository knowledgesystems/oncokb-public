package org.mskcc.cbio.oncokb.service;

import org.mskcc.cbio.oncokb.domain.Token;
import org.mskcc.cbio.oncokb.domain.User;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Service Interface for managing {@link Token}.
 */
public interface TokenService {

    /**
     * Save a token.
     *
     * @param token the entity to save.
     * @return the persisted entity.
     */
    Token save(Token token);

    /**
     * Get all the tokens.
     *
     * @return the list of entities.
     */
    List<Token> findAll();


    /**
     * Get the "id" token.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Token> findOne(Long id);

    Optional<Token> findPublicWebsiteToken();

    Optional<Token> findByToken(String token);

    List<Token> findByUserIsCurrentUser();

    List<Token> findByUser(User user);

    List<Token> findValidByUser(User user);

    /**
     *
     * @param id the id of the entity
     * @param increment the increment the token usage will add
     */
    void increaseTokenUsage(Long id, int increment);

    List<Token> findAllExpiresBeforeDate(Instant date);

    void expireToken(Token token);

    void delete(Long id);

    /**
     * Delete the token and associates its token stats with a new token.
     * @param id id of token
     */
    void deleteAndAssociateStats(Long id);

    /**
     * Delete all tokens related to the user
     *
     * @param user the token associated user
     */
    void deleteAllByUser(User user);
}
