package org.mskcc.cbio.oncokb;

import io.sentry.Sentry;
import org.mskcc.cbio.oncokb.config.application.ApplicationProperties;

import io.github.jhipster.config.DefaultProfileUtil;
import io.github.jhipster.config.JHipsterConstants;

import org.apache.commons.lang3.StringUtils;
import org.mskcc.cbio.oncokb.service.EmailAlreadyUsedException;
import org.mskcc.cbio.oncokb.service.InvalidPasswordException;
import org.mskcc.cbio.oncokb.service.UsernameAlreadyUsedException;
import org.mskcc.cbio.oncokb.web.rest.errors.TokenExpiredException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.liquibase.LiquibaseProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.core.env.Environment;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.client.HttpClientErrorException;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.Arrays;
import java.util.Collection;

@SpringBootApplication
@EnableConfigurationProperties({LiquibaseProperties.class, ApplicationProperties.class})
public class OncokbPublicApp {

    private static final Logger log = LoggerFactory.getLogger(OncokbPublicApp.class);

    private final Environment env;

    public OncokbPublicApp(Environment env) {
        this.env = env;
    }

    /**
     * Initializes oncokb.
     * <p>
     * Spring profiles can be configured with a program argument --spring.profiles.active=your-active-profile
     * <p>
     * You can find more information on how profiles work with JHipster on <a href="https://www.jhipster.tech/profiles/">https://www.jhipster.tech/profiles/</a>.
     */
    @PostConstruct
    public void initApplication() {
        Collection<String> activeProfiles = Arrays.asList(env.getActiveProfiles());
        if (activeProfiles.contains(JHipsterConstants.SPRING_PROFILE_DEVELOPMENT) && activeProfiles.contains(JHipsterConstants.SPRING_PROFILE_PRODUCTION)) {
            log.error("You have misconfigured your application! It should not run " +
                "with both the 'dev' and 'prod' profiles at the same time.");
        }
        if (activeProfiles.contains(JHipsterConstants.SPRING_PROFILE_DEVELOPMENT) && activeProfiles.contains(JHipsterConstants.SPRING_PROFILE_CLOUD)) {
            log.error("You have misconfigured your application! It should not " +
                "run with both the 'dev' and 'cloud' profiles at the same time.");
        }
    }

    /**
     * Main method, used to run the application.
     *
     * @param args the command line arguments.
     */
    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(OncokbPublicApp.class);
        DefaultProfileUtil.addDefaultProfile(app);
        Environment env = app.run(args).getEnvironment();
        logApplicationStartup(env);
        initSentry(env);
    }

    private static void initSentry(Environment env) {
        Sentry.init(options -> {
            options.setDsn(env.getProperty("sentry.dsn"));
            options.setEnableUncaughtExceptionHandler(true);
            // Set traces_sample_rate to 1.0 to capture 100% of transactions for performance monitoring.
            // We recommend adjusting this value in production.
            options.setTracesSampleRate(.2);
            // When first trying Sentry it's good to see what the SDK is doing:
            options.setDebug(false);

            // Ignore the following exceptions
            options.addIgnoredExceptionForType(BadCredentialsException.class);
            options.addIgnoredExceptionForType(IOException.class);
            options.addIgnoredExceptionForType(HttpClientErrorException.class);
            options.addIgnoredExceptionForType(EmailAlreadyUsedException.class);
            options.addIgnoredExceptionForType(InvalidPasswordException.class);
            options.addIgnoredExceptionForType(UsernameAlreadyUsedException.class);
            options.addIgnoredExceptionForType(HttpRequestMethodNotSupportedException.class);
            options.addIgnoredExceptionForType(TokenExpiredException.class);
        });
    }

    private static void logApplicationStartup(Environment env) {
        String protocol = "http";
        if (env.getProperty("server.ssl.key-store") != null) {
            protocol = "https";
        }
        String serverPort = env.getProperty("server.port");
        String contextPath = env.getProperty("server.servlet.context-path");
        if (StringUtils.isBlank(contextPath)) {
            contextPath = "/";
        }
        String hostAddress = "localhost";
        try {
            hostAddress = InetAddress.getLocalHost().getHostAddress();
        } catch (UnknownHostException e) {
            log.warn("The host name could not be determined, using `localhost` as fallback");
        }
        log.info("\n----------------------------------------------------------\n\t" +
                "Application '{}' is running! Access URLs:\n\t" +
                "Local: \t\t{}://localhost:{}{}\n\t" +
                "External: \t{}://{}:{}{}\n\t" +
                "Profile(s): \t{}\n----------------------------------------------------------",
            env.getProperty("spring.application.name"),
            protocol,
            serverPort,
            contextPath,
            protocol,
            hostAddress,
            serverPort,
            contextPath,
            env.getActiveProfiles());
    }
}
