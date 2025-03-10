package org.mskcc.cbio.oncokb.security.uuid;

import org.mskcc.cbio.oncokb.domain.Authority;
import org.mskcc.cbio.oncokb.domain.Token;
import org.mskcc.cbio.oncokb.domain.TokenKey;
import org.mskcc.cbio.oncokb.domain.User;
import org.mskcc.cbio.oncokb.domain.enumeration.TokenType;
import org.mskcc.cbio.oncokb.repository.UserRepository;
import org.mskcc.cbio.oncokb.security.AuthoritiesConstants;
import org.mskcc.cbio.oncokb.security.SecurityUtils;
import org.mskcc.cbio.oncokb.service.TokenService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

import static org.mskcc.cbio.oncokb.config.Constants.*;

@Component("tokenProvider")
public class TokenProvider implements InitializingBean {

    private final Logger log = LoggerFactory.getLogger(TokenProvider.class);

    // This is for general users
    public static final int EXPIRATION_TIME_IN_SECONDS = DEFAULT_TOKEN_EXPIRATION_IN_SECONDS;

    // This is for the public website
    private static final int EXPIRATION_TIME_PUBLIC_WEBSITE_IN_SECONDS = 60 * 60;

    private UserRepository userRepository;

    private TokenService tokenService;

    public TokenProvider(UserRepository userRepository, TokenService tokenService) {
        this.userRepository = userRepository;
        this.tokenService = tokenService;
    }

    @Override
    public void afterPropertiesSet() throws Exception {
    }

    public List<Token> getUserTokens(User userLogin) {
        return tokenService.findByUser(userLogin);
    }

    private Token getNewToken(Set<Authority> authorities, TokenType tokenType, Optional<Instant> definedExpirationTime) {
        return getNewToken(authorities, tokenType, definedExpirationTime, Optional.of(true));
    }

    private Token getNewToken(Set<Authority> authorities, TokenType tokenType, Optional<Instant> definedExpirationTime, Optional<Boolean> isRenewable) {
        Token token = new Token();
        Instant currentTime = Instant.now();
        token.setCreation(currentTime);

        if (isRenewable.isPresent()) {
            token.setRenewable(isRenewable.get());
        } else {
            token.setRenewable(true);
        }

        if (definedExpirationTime.isPresent()) {
            token.setExpiration(definedExpirationTime.get());
        } else {
            Instant expirationTime = authorities.stream().filter(
                authority -> authority.getName().equalsIgnoreCase(AuthoritiesConstants.PUBLIC_WEBSITE)).count() > 0 ?
                Instant.now().plusSeconds(EXPIRATION_TIME_PUBLIC_WEBSITE_IN_SECONDS) : currentTime.plusSeconds(EXPIRATION_TIME_IN_SECONDS);
            token.setExpiration(expirationTime);
        }
        token.setToken(TokenKey.generate(tokenType).getFullToken());
        return token;
    }

    public Token createTokenForCurrentUserLogin(Optional<Instant> definedExpirationTime, Optional<Boolean> isRenewable) {
        Optional<User> userOptional = userRepository.findOneWithAuthoritiesByLogin(SecurityUtils.getCurrentUserLogin().get());
        if(userOptional.isPresent()) {
            return createToken(userOptional.get(), TokenType.USER ,definedExpirationTime, isRenewable, Optional.empty());
        }
        return null;
    }

    public Token createToken(User user, TokenType tokenType, Optional<Instant> definedExpirationTime, Optional<Boolean> isRenewable, Optional<String> name) {
        Token token = getNewToken(user.getAuthorities(), tokenType, definedExpirationTime, isRenewable);
        token.setUser(user);
        if (name.isPresent()) {
            token.setName(name.get());
        }
        tokenService.save(token);
        return token;
    }

    public void createToken(Token token, TokenType tokenType, Optional<String> name){
        Token newToken = createToken(token.getUser(), tokenType, Optional.of(token.getExpiration()), Optional.of(token.isRenewable()), name);
        newToken.setCreation(token.getCreation());
        newToken.setCurrentUsage(token.getCurrentUsage());
        newToken.setUsageLimit(token.getUsageLimit());
        tokenService.save(newToken);
    }

    // This method is used in the frontend thymeleaf parsing
    public String getPubWebToken() {
        Optional<User> user = userRepository.findOneWithAuthoritiesByLogin(PUBLIC_WEBSITE_LOGIN);
        if (user.isPresent()) {
            Token userToken = new Token();
            Optional<Token> tokenOptional  = tokenService.findPublicWebsiteToken();
            if (!tokenOptional.isPresent()) {
                Token newToken = getNewToken(user.get().getAuthorities(), TokenType.USER, Optional.empty());
                newToken.setUser(user.get());
                userToken = tokenService.save(newToken);
            } else {
                userToken = tokenOptional.get();
                if (userToken.getExpiration().isBefore(Instant.now())) {
                    // I want to update the token associated with public website once it's expired
                    Token newToken = getNewToken(user.get().getAuthorities(), TokenType.USER, Optional.empty(), Optional.empty());
                    userToken.setToken(newToken.getToken());
                    userToken.setCreation(newToken.getCreation());
                    userToken.setExpiration(newToken.getExpiration());
                    // Reset the usage after recreating the token
                    userToken.setCurrentUsage(0);
                    userToken = tokenService.save(userToken);
                }
            }
            return userToken.getToken();
        }
        return null;
    }

    public Authentication getAuthentication(String token) {
        Optional<Token> tokenOptional = tokenService.findByToken(token);

        Optional<User> user = userRepository.findOneWithAuthoritiesByLogin(tokenOptional.get().getUser().getLogin());
        Collection<? extends GrantedAuthority> authorities =
            user.get().getAuthorities().stream()
                .map(authority -> new SimpleGrantedAuthority(authority.getName()))
                .collect(Collectors.toList());

        return new UsernamePasswordAuthenticationToken(user.get().getLogin(), token, authorities);
    }

    public boolean validateToken(String tokenValue) {
        try {
            Optional<Token> token = tokenService.findByToken(tokenValue);
            if (token.isPresent() && token.get().getExpiration().isAfter(Instant.now())) {
                if(token.get().getUsageLimit() == null || token.get().getCurrentUsage() < token.get().getUsageLimit()) {
                    return true;
                }else{
                    return false;
                }
            }
            return false;
        } catch (Exception e) {
            log.info("The token is invalid.");
            log.trace("UUID token compact of handler are invalid trace: {}", e);
        }
        return false;
    }
}
