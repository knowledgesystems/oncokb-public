package org.mskcc.cbio.oncokb.service.impl;

import org.mskcc.cbio.oncokb.config.cache.CacheNameResolver;
import org.mskcc.cbio.oncokb.domain.Token;
import org.mskcc.cbio.oncokb.domain.User;
import org.mskcc.cbio.oncokb.repository.TokenRepository;
import org.mskcc.cbio.oncokb.repository.TokenStatsRepository;
import org.mskcc.cbio.oncokb.service.TokenService;
import org.mskcc.cbio.oncokb.web.rest.errors.CustomMessageRuntimeException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import static org.mskcc.cbio.oncokb.config.cache.TokenCacheResolver.TOKENS_BY_USER_LOGIN_CACHE;
import static org.mskcc.cbio.oncokb.config.cache.TokenCacheResolver.TOKEN_BY_UUID_CACHE;

/**
 * Service Implementation for managing {@link Token}.
 */
@Service
@Transactional
public class TokenServiceImpl implements TokenService {

    private final Logger log = LoggerFactory.getLogger(TokenServiceImpl.class);

    private final TokenRepository tokenRepository;

    private final TokenStatsRepository tokenStatsRepository;

    private final CacheManager cacheManager;

    private final CacheNameResolver cacheNameResolver;


    public TokenServiceImpl(
        TokenRepository tokenRepository,
        CacheManager cacheManager,
        CacheNameResolver cacheNameResolver,
        TokenStatsRepository tokenStatsRepository
    ) {
        this.tokenRepository = tokenRepository;
        this.tokenStatsRepository = tokenStatsRepository;
        this.cacheManager = cacheManager;
        this.cacheNameResolver = cacheNameResolver;
    }

    @Override
    public Token save(Token token) {
        log.debug("Request to save Token : {}", token);

        Token updatedToken = tokenRepository.save(token);
        this.clearTokenCaches(token);
        return updatedToken;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Token> findAll() {
        log.debug("Request to get all Tokens");
        return tokenRepository.findAll();
    }


    @Override
    @Transactional(readOnly = true)
    public Optional<Token> findOne(Long id) {
        log.debug("Request to get Token : {}", id);
        return tokenRepository.findById(id);
    }

    @Override
    public Optional<Token> findPublicWebsiteToken() {
        return tokenRepository.findPublicWebsiteToken();
    }

    @Override
    public Optional<Token> findByToken(String token) {
        return tokenRepository.findByToken(token);
    }

    @Override
    public List<Token> findByUserIsCurrentUser() {
        return tokenRepository.findByUserIsCurrentUser();
    }

    @Override
    public List<Token> findByUser(User user) {
        return tokenRepository.findByUserLogin(user.getLogin());
    }

    @Override
    public List<Token> findValidByUser(User user) {
        return tokenRepository.findByUserLogin(user.getLogin()).stream().filter(token -> token.getExpiration().isAfter(Instant.now())).collect(Collectors.toList());
    }

    @Override
    public void increaseTokenUsage(Long id, int increment) {
        tokenRepository.increaseTokenUsage(id, increment);
        Optional<Token> tokenOptional = tokenRepository.findById(id);
        if (tokenOptional.isPresent()) {
            this.clearTokenCaches(tokenOptional.get());
        }
    }

    @Override
    public List<Token> findAllExpiresBeforeDate(Instant date) {
        return tokenRepository.findAllExpiresBeforeDate(date);
    }

    @Override
    public void expireToken(Token token) {
        token.setExpiration(Instant.now());
        save(token);
    }

    @Override
    public void deleteAndAssociateStats(Long id) {
        log.debug("Request to delete Token : {}", id);

        Optional<Token> tokenOptional = tokenRepository.findById(id);
        if (!tokenOptional.isPresent()) {
            throw new CustomMessageRuntimeException("Token could not be found");
        }
        Token token = tokenOptional.get();

        List<Token> tokens = findByUser(token.getUser());
        if (tokens.size() < 2) {
            expireToken(token);
        } else {
            // Ideally, users should have at most two tokens, so deleting one will just mean that
            // we assign the token's expiration to the other token.
            // In case where user has more than two tokens, we apply the expiration of the longest token
            // to the second longest token.
            Instant timestamp = token.getExpiration();
            tokens = tokens.stream().filter(t -> !t.getId().equals(token.getId())).collect(Collectors.toCollection(ArrayList::new));
            Token longestToken = tokens.stream().max(Comparator.comparing(Token::getExpiration)).get();
            if (timestamp.isAfter(longestToken.getExpiration())) {
                longestToken.setExpiration(timestamp);
                save(longestToken);
            }

            // Assign the token's token stats to a new token before deleting
            tokenStatsRepository.updateAssociatedToken(token, longestToken);
            tokenRepository.delete(token);
            this.clearTokenCaches(token);
        }

    }

    @Override
    public void delete(Long id) {
        Optional<Token> tokenOptional = tokenRepository.findById(id);
        if (!tokenOptional.isPresent()) {
            throw new CustomMessageRuntimeException("Token could not be found");
        }
        tokenRepository.delete(tokenOptional.get());
    }

    @Override
    public void deleteAllByUser(User user) {
        tokenRepository.deleteAllByUser(user);
    }

    private void clearTokenCaches(Token token) {
        Objects.requireNonNull(cacheManager.getCache(this.cacheNameResolver.getCacheName(TOKEN_BY_UUID_CACHE))).evict(token.getToken());
        Objects.requireNonNull(cacheManager.getCache(this.cacheNameResolver.getCacheName(TOKENS_BY_USER_LOGIN_CACHE))).evict(token.getUser().getLogin());
    }
}
