package org.mskcc.cbio.oncokb.config;

import org.mskcc.cbio.oncokb.security.AuthoritiesConstants;
import org.mskcc.cbio.oncokb.security.uuid.TokenProvider;
import org.mskcc.cbio.oncokb.security.uuid.UUIDConfigurer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.firewall.StrictHttpFirewall;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter;
import org.springframework.web.filter.CorsFilter;
import org.zalando.problem.spring.web.advice.security.SecurityProblemSupport;

@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true, securedEnabled = true)
@Import(SecurityProblemSupport.class)
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

    private final TokenProvider tokenProvider;

    private final CorsFilter corsFilter;
    private final SecurityProblemSupport problemSupport;

    public SecurityConfiguration(TokenProvider tokenProvider, CorsFilter corsFilter, SecurityProblemSupport problemSupport) {
        this.tokenProvider = tokenProvider;
        this.corsFilter = corsFilter;
        this.problemSupport = problemSupport;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Override
    public void configure(WebSecurity web) {
        web.ignoring()
            .antMatchers(HttpMethod.OPTIONS, "/**")
            .antMatchers("/app/**/*.{js,html}")
            .antMatchers("/*.xml")
            .antMatchers("/i18n/**")
            .antMatchers("/content/**")
            .antMatchers("/swagger-ui/index.html")
            .antMatchers("/test/**");

        StrictHttpFirewall firewall = new StrictHttpFirewall();
        firewall.setAllowUrlEncodedSlash(true);
        firewall.setAllowUrlEncodedPercent(true);
        web.httpFirewall(firewall);
    }

    @Override
    public void configure(HttpSecurity http) throws Exception {
        // @formatter:off
        http
            .csrf()
            .disable()
            .addFilterBefore(corsFilter, UsernamePasswordAuthenticationFilter.class)
            .exceptionHandling()
                .authenticationEntryPoint(problemSupport)
                .accessDeniedHandler(problemSupport)
        .and()
            .headers()
            .contentSecurityPolicy("default-src 'self'; frame-src 'self' https://*.google.com https://www.recaptcha.net https://*.oncokb.org https://*.youtube-nocookie.com https://*.bilibili.com https://*.gitbook.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com/ https://storage.googleapis.com www.google-analytics.com https://www.googletagmanager.com https://recaptcha.net https://www.gstatic.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: www.google-analytics.com; font-src 'self' data:; connect-src 'self' https://*;")
        .and()
            .referrerPolicy(ReferrerPolicyHeaderWriter.ReferrerPolicy.NO_REFERRER_WHEN_DOWNGRADE)
        .and()
            .featurePolicy("geolocation 'none'; midi 'none'; sync-xhr 'none'; microphone 'none'; camera 'none'; magnetometer 'none'; gyroscope 'none'; speaker 'none'; fullscreen 'self'; payment 'none'")
        .and()
            .frameOptions()
            .deny()
        .and()
            .sessionManagement()
            .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        .and()
            .authorizeRequests()
            .antMatchers("/api/v1/info").permitAll()
            .antMatchers("/api/v1/levels/**").permitAll()
            .antMatchers("/api/v1/therapeutic-levels/**").permitAll()
            .antMatchers("/api/v1/diagnostic-levels/**").permitAll()
            .antMatchers("/api/v1/prognostic-levels/**").permitAll()
            .antMatchers("/api/authenticate").permitAll()
            .antMatchers("/api/register").permitAll()
            .antMatchers("/api/activate").permitAll()
            .antMatchers("/api/slack").permitAll()
            .antMatchers("/api/secret-scanning").permitAll()
            // Permits the api swagger definitions through proxy
            .antMatchers("/api/v1/v2/api-docs").permitAll()
            .antMatchers("/api/private/utils/data/**").hasAnyAuthority(AuthoritiesConstants.DATA_DOWNLOAD, AuthoritiesConstants.PREMIUM_USER)

            .antMatchers("/api/v1/annotate/sample").hasAnyAuthority(AuthoritiesConstants.PREMIUM_USER, AuthoritiesConstants.ADMIN) // Order matters here
            .antMatchers("/api/v1/annotate/**").hasAnyAuthority(AuthoritiesConstants.API, AuthoritiesConstants.ROLE_SERVICE_ACCOUNT)

            .antMatchers("/api/v1/genes/lookup").hasAnyAuthority(AuthoritiesConstants.PUBLIC_WEBSITE, AuthoritiesConstants.USER, AuthoritiesConstants.ADMIN)
            .antMatchers("/api/v1/variants/lookup").hasAnyAuthority(AuthoritiesConstants.PUBLIC_WEBSITE, AuthoritiesConstants.USER, AuthoritiesConstants.ADMIN)
            .antMatchers("/api/v1/evidences/**").hasAnyAuthority(AuthoritiesConstants.PUBLIC_WEBSITE, AuthoritiesConstants.USER, AuthoritiesConstants.ADMIN)

            .antMatchers("/api/v1/utils/allCuratedGenes").permitAll()
            .antMatchers("/api/v1/utils/allCuratedGenes.txt").permitAll()
            .antMatchers("/api/v1/utils/allCuratedGenes.json").permitAll()
            .antMatchers("/api/v1/utils/cancerGeneList").permitAll()
            .antMatchers("/api/v1/utils/cancerGeneList.txt").permitAll()
            .antMatchers("/api/v1/utils/cancerGeneList.json").permitAll()

            .antMatchers("/api/v1/annotation/search").hasAnyAuthority(AuthoritiesConstants.PREMIUM_USER, AuthoritiesConstants.ADMIN)
            .antMatchers("/api/v1/drugs").hasAnyAuthority(AuthoritiesConstants.PREMIUM_USER, AuthoritiesConstants.ADMIN)
            .antMatchers("/api/v1/utils/allActionableVariants").hasAnyAuthority(AuthoritiesConstants.PREMIUM_USER, AuthoritiesConstants.ADMIN)
            .antMatchers("/api/v1/utils/allActionableVariants.txt").hasAnyAuthority(AuthoritiesConstants.PREMIUM_USER, AuthoritiesConstants.ADMIN, AuthoritiesConstants.DATA_DOWNLOAD)
            .antMatchers("/api/v1/utils/allAnnotatedVariants").hasAnyAuthority(AuthoritiesConstants.PREMIUM_USER, AuthoritiesConstants.ADMIN)
            .antMatchers("/api/v1/utils/allAnnotatedVariants.txt").hasAnyAuthority(AuthoritiesConstants.PREMIUM_USER, AuthoritiesConstants.ADMIN, AuthoritiesConstants.DATA_DOWNLOAD)
            .antMatchers("/api/v1/utils/allVariantsOfUnknownSignificance").hasAnyAuthority(AuthoritiesConstants.PREMIUM_USER, AuthoritiesConstants.ADMIN)
            .antMatchers("/api/v1/utils/allVariantsOfUnknownSignificance.txt").hasAnyAuthority(AuthoritiesConstants.PREMIUM_USER, AuthoritiesConstants.ADMIN)

            .antMatchers("/api/v1/**").hasAnyAuthority(AuthoritiesConstants.ADMIN)

            .antMatchers("/api/account/reset-password/init").permitAll()
            .antMatchers("/api/account/reset-password/finish").permitAll()
            .antMatchers("/api/account/resend-verification").permitAll()
            .antMatchers("/api/account/generate-reset-key").hasAnyAuthority(AuthoritiesConstants.ADMIN)
            .antMatchers("/api/account/active-trial/init").hasAnyAuthority(AuthoritiesConstants.ADMIN)
            .antMatchers("/api/account/active-trial/finish").permitAll()
            .antMatchers("/api/account/active-trial/info").permitAll()
            .antMatchers("/api/account/**").hasAnyAuthority(AuthoritiesConstants.USER)

            .antMatchers("/api/users/**").hasAnyAuthority(AuthoritiesConstants.ADMIN)
            .antMatchers("/api/user-details/**").hasAnyAuthority(AuthoritiesConstants.ADMIN)
            .antMatchers(HttpMethod.GET, "/api/tokens/{\\d+}").permitAll()
            .antMatchers("/api/tokens/**").hasAnyAuthority(AuthoritiesConstants.ADMIN)
            .antMatchers("/api/token-stats/**").hasAnyAuthority(AuthoritiesConstants.ADMIN)

            .antMatchers("/api/companies/service-account/token").hasAnyAuthority(AuthoritiesConstants.ROLE_COMPANY_ADMIN)
            .antMatchers("/api/companies/**").hasAnyAuthority(AuthoritiesConstants.ADMIN)
            .antMatchers("/api/company-domains/**").hasAnyAuthority(AuthoritiesConstants.ADMIN)

            .antMatchers("/api/cronjob/**").hasAnyAuthority(AuthoritiesConstants.BOT)

            .antMatchers("/api/mails/feedback").hasAnyAuthority(AuthoritiesConstants.PUBLIC_WEBSITE, AuthoritiesConstants.USER)
            .antMatchers("/api/mails/**").hasAnyAuthority(AuthoritiesConstants.ADMIN)
            .antMatchers("/api/user-mails/**").hasAnyAuthority(AuthoritiesConstants.ADMIN)

            .antMatchers("/api/**").hasAnyAuthority(AuthoritiesConstants.PUBLIC_WEBSITE, AuthoritiesConstants.USER)


            .antMatchers("/management/**").hasAuthority(AuthoritiesConstants.ADMIN)
        .and()
            .httpBasic()
        .and()
            .apply(securityConfigurerAdapter());
        // @formatter:on
    }

    private UUIDConfigurer securityConfigurerAdapter() {
        return new UUIDConfigurer(tokenProvider);
    }
}
