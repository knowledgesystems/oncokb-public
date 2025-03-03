package org.mskcc.cbio.oncokb.security.uuid;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.GenericFilterBean;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

/**
 * Filters incoming requests and installs a Spring Security principal if a header corresponding to a valid user is
 * found.
 */
public class UUIDFilter extends GenericFilterBean {

    public static final String AUTHORIZATION_HEADER = "Authorization";

    private TokenProvider tokenProvider;

    public UUIDFilter(TokenProvider tokenProvider) {
        this.tokenProvider = tokenProvider;
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain)
        throws IOException, ServletException {
        HttpServletRequest httpServletRequest = (HttpServletRequest) servletRequest;
        String token = resolveToken(httpServletRequest);
        if (token != null && this.tokenProvider.validateToken(token)) {
            Authentication authentication = this.tokenProvider.getAuthentication(token);
            SecurityContextHolder.getContext().setAuthentication(authentication);
//            this.tokenProvider.addAccessRecord(uuid, servletRequest.getRemoteAddr());
        }
        filterChain.doFilter(servletRequest, servletResponse);
    }

    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader(AUTHORIZATION_HEADER);
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            try {
                return bearerToken.substring(7);
            } catch (Exception e) {
                logger.info("Invalid token.");
                return null;
            }
        }
        return null;
    }
}
