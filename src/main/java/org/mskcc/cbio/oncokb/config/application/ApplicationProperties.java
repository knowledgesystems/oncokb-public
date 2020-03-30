package org.mskcc.cbio.oncokb.config.application;

import org.mskcc.cbio.oncokb.domain.enumeration.ProjectProfile;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Properties specific to Oncokb.
 * <p>
 * Properties are configured in the {@code application.yml} file.
 * See {@link io.github.jhipster.config.JHipsterProperties} for a good example.
 */
@ConfigurationProperties(prefix = "application", ignoreUnknownFields = false)
public class ApplicationProperties {
    private String apiProxyUrl;
    private String userRegistrationWebhook;
    private ProjectProfile profile;
    private Boolean sitemapEnabled;
    private RedisProperties redis;
    private String accountApprovalWhitelist;
    private String academicEmailClarifyDomain;
    private String googleWebmasterVerification;
    private EmailAddresses emailAddresses;
    private String tokenUsageCheck;
    private String tokenUsageCheckWhitelist;

    public String getApiProxyUrl() {
        return apiProxyUrl;
    }

    public void setApiProxyUrl(String apiProxyUrl) {
        this.apiProxyUrl = apiProxyUrl;
    }

    public String getUserRegistrationWebhook() {
        return userRegistrationWebhook;
    }

    public void setUserRegistrationWebhook(String userRegistrationWebhook) {
        this.userRegistrationWebhook = userRegistrationWebhook;
    }

    public String getAccountApprovalWhitelist() {
        return accountApprovalWhitelist;
    }

    public void setAccountApprovalWhitelist(String accountApprovalWhitelist) {
        this.accountApprovalWhitelist = accountApprovalWhitelist;
    }

    public String getAcademicEmailClarifyDomain() {
        return academicEmailClarifyDomain;
    }

    public void setAcademicEmailClarifyDomain(String academicEmailClarifyDomain) {
        this.academicEmailClarifyDomain = academicEmailClarifyDomain;
    }

    public ProjectProfile getProfile() {
        return profile;
    }

    public void setProfile(ProjectProfile profile) {
        this.profile = profile;
    }

    public Boolean getSitemapEnabled() {
        return sitemapEnabled;
    }

    public void setSitemapEnabled(Boolean sitemapEnabled) {
        this.sitemapEnabled = sitemapEnabled;
    }

    public RedisProperties getRedis() {
        return redis;
    }

    public void setRedis(RedisProperties redis) {
        this.redis = redis;
    }

    public String getGoogleWebmasterVerification() {
        return googleWebmasterVerification;
    }

    public void setGoogleWebmasterVerification(String googleWebmasterVerification) {
        this.googleWebmasterVerification = googleWebmasterVerification;
    }

    public EmailAddresses getEmailAddresses() {
        return emailAddresses;
    }

    public void setEmailAddresses(EmailAddresses emailAddresses) {
        this.emailAddresses = emailAddresses;
    }

    public String getTokenUsageCheck() {
        return tokenUsageCheck;
    }

    public void setTokenUsageCheck(String tokenUsageCheck) {
        this.tokenUsageCheck = tokenUsageCheck;
    }

    public String getTokenUsageCheckWhitelist() {
        return tokenUsageCheckWhitelist;
    }

    public void setTokenUsageCheckWhitelist(String tokenUsageCheckWhitelist) {
        this.tokenUsageCheckWhitelist = tokenUsageCheckWhitelist;
    }
}
