package org.mskcc.cbio.oncokb.service;

import io.github.jhipster.config.JHipsterProperties;
import org.apache.commons.lang3.StringUtils;
import org.mskcc.cbio.oncokb.config.application.ApplicationProperties;

import javax.mail.MessagingException;

import org.mskcc.cbio.oncokb.domain.enumeration.LicenseType;
import org.mskcc.cbio.oncokb.domain.Company;
import org.mskcc.cbio.oncokb.domain.UserMessagePair;
import org.mskcc.cbio.oncokb.domain.enumeration.MailType;
import org.mskcc.cbio.oncokb.service.dto.TerminationEmailDTO;
import org.mskcc.cbio.oncokb.service.dto.UserDTO;
import org.mskcc.cbio.oncokb.service.dto.UserMailsDTO;
import org.mskcc.cbio.oncokb.web.rest.vm.ExposedToken;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.MessageSource;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring5.SpringTemplateEngine;

import javax.mail.internet.MimeMessage;
import java.io.File;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

import static org.mskcc.cbio.oncokb.config.Constants.MAIL_LICENSE;
import static org.mskcc.cbio.oncokb.domain.enumeration.MailType.TRIAL_ACCOUNT_IS_ABOUT_TO_EXPIRE;
import static org.mskcc.cbio.oncokb.domain.enumeration.MailType.TOKEN_HAS_BEEN_EXPOSED;
import static org.mskcc.cbio.oncokb.domain.enumeration.MailType.SEARCHING_RESPONSE_STRUCTURE_HAS_CHANGED;
import static org.mskcc.cbio.oncokb.domain.enumeration.MailType.LIST_OF_UNAPPROVED_USERS;

/**
 * Service for sending emails.
 * <p>
 * We use the {@link Async} annotation to send emails asynchronously.
 */
@Service
public class MailService {

    private final Logger log = LoggerFactory.getLogger(MailService.class);

    private static final String USER = "user";

    private static final String BASE_URL = "baseUrl";

    private static final String EXPIRE_IN_DAYS = "expiresInDays";
    private static final String EMAIL_TITLE = "emailTitle";

    private final JHipsterProperties jHipsterProperties;

    private final ApplicationProperties applicationProperties;

    private final JavaMailSender javaMailSender;

    private final MessageSource messageSource;

    private final SpringTemplateEngine templateEngine;

    private final UserMailsService userMailsService;

    public MailService(JHipsterProperties jHipsterProperties, JavaMailSender javaMailSender,
                       MessageSource messageSource, SpringTemplateEngine templateEngine,
                       UserMailsService userMailsService, ApplicationProperties applicationProperties
    ) {

        this.jHipsterProperties = jHipsterProperties;
        this.javaMailSender = javaMailSender;
        this.messageSource = messageSource;
        this.templateEngine = templateEngine;
        this.userMailsService = userMailsService;
        this.applicationProperties = applicationProperties;
    }

    private static class UnknownMailTypeException extends RuntimeException {
        private UnknownMailTypeException() {
            super("Cannot identify the MailType.");
        }
    }

    public void sendEmail(TerminationEmailDTO dto) throws MessagingException {
        log.debug("Send email to company ID '{}' with subject '{}' and content={}",
            dto.getCompanyId(),  dto.getSubject(), dto.getContent());

        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        MimeMessageHelper message = new MimeMessageHelper(mimeMessage, false, StandardCharsets.UTF_8.name());
        message.setFrom(dto.getFrom());
        message.setBcc(dto.getBcc().split(";"));
        message.setCc(dto.getCc().split(";"));
        message.setSubject(dto.getSubject());
        message.setText(dto.getContent(), false);
        javaMailSender.send(mimeMessage);
    }

    @Async
    public void sendEmail(String to, String from, String cc, String subject, String content, List<String> attachmentFilesNames, boolean isMultipart, boolean isHtml) throws MessagingException {
        log.debug("Send email[multipart '{}' and html '{}'] to '{}' with subject '{}' and content={}",
            isMultipart, isHtml, to, subject, content);

        // Prepare message using a Spring helper
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        MimeMessageHelper message = new MimeMessageHelper(mimeMessage, isMultipart, StandardCharsets.UTF_8.name());
        message.setTo(to);
        if (StringUtils.isNotEmpty(cc)) {
            message.setCc(cc);
        }
        message.setFrom(from);
        if (StringUtils.isEmpty(subject)) {
            subject = "No subject specified";
        }
        message.setSubject(subject);
        message.setText(content, isHtml);

        if (attachmentFilesNames != null) {
            attachmentFilesNames.forEach(filename -> {
                try {
                    message.addAttachment(filename, new File(getClass().getClassLoader().getResource("files/" + filename).getFile()));
                } catch (MessagingException e) {
                    // having issue attach the file
                    e.printStackTrace();
                }
            });
        }
        javaMailSender.send(mimeMessage);
    }

    @Async
    public void sendEmailToDevTeam(String subject, String content, List<String> attachmentFilesNames, boolean isMultipart, boolean isHtml) throws MessagingException {
        this.sendEmail(this.applicationProperties.getEmailAddresses().getTechDevAddress(), this.applicationProperties.getEmailAddresses().getTechDevAddress(), null, subject, content, attachmentFilesNames, isMultipart, isHtml);
    }

    public void sendFeedback(String from, String subject, String content) throws MessagingException {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        MimeMessageHelper message = new MimeMessageHelper(mimeMessage, false, StandardCharsets.UTF_8.name());
        message.setTo(applicationProperties.getEmailAddresses().getContactAddress());
        if (StringUtils.isNotEmpty(from)) {
            message.setReplyTo(from);
        }
        message.setFrom(applicationProperties.getEmailAddresses().getContactAddress());
        message.setSubject(subject);
        message.setText(content, false);
        javaMailSender.send(mimeMessage);
    }

    private void addUserMailsRecord(UserDTO userDTO, MailType mailType, String sentFrom, String sentBy) {
        UserMailsDTO userMailsDTO = new UserMailsDTO();
        userMailsDTO.setMailType(mailType);
        userMailsDTO.setSentDate(Instant.now());
        userMailsDTO.setSentFrom(sentFrom);
        userMailsDTO.setSentBy(sentBy);
        userMailsDTO.setUserId(userDTO.getId());
        userMailsService.save(userMailsDTO);
    }

    @Async
    public void sendEmailFromTemplate(UserDTO user, MailType mailType) {
        sendEmailFromTemplate(user, mailType, null);
    }

    @Async
    public void sendEmailFromTemplate(UserDTO user, MailType mailType, Context additionalContext) {
        sendEmailFromTemplate(
            user, mailType, messageSource.getMessage(mailType.getTitleKey(), new Object[]{}, Locale.forLanguageTag(user.getLangKey())),
            jHipsterProperties.getMail().getFrom(), null, jHipsterProperties.getMail().getFrom(), additionalContext);
    }

    @Async
    public void sendEmailWithLicenseContext(UserDTO user, MailType mailType, String from, String cc, String by) {
        Context context = new Context();
        context.setVariable(MAIL_LICENSE, user.getLicenseType().getName());
        sendEmailFromTemplate(user, mailType,
            messageSource.getMessage(mailType.getTitleKey(), new Object[]{user.getLicenseType().getName()}, Locale.forLanguageTag(user.getLangKey())),
            from, cc, by, context);
    }

    /**
     * @param user     UserDTO
     * @param mailType MailType
     * @param days     Days to expire, must more than one day.
     */
    @Async
    public void sendEmailDeclareEmailOwnership(UserDTO user, MailType mailType, int days) {
        Context context = new Context();
        context.setVariable(EXPIRE_IN_DAYS, days);
        sendEmailFromTemplate(user, mailType,
            messageSource.getMessage(mailType.getTitleKey(), new Object[]{days}, Locale.forLanguageTag(user.getLangKey())),
            applicationProperties.getEmailAddresses().getRegistrationAddress(), null, null, context);
    }

    @Async
    public void sendEmailFromSlack(UserDTO user, String subject, String body, MailType mailType, String sendBy) {
        try {
            String defaultEmailSendFrom = applicationProperties.getEmailAddresses().getRegistrationAddress();
            String ccAddress = null;
            if (MailType.LICENSE_OPTIONS.equals(mailType)) {
                defaultEmailSendFrom = applicationProperties.getEmailAddresses().getLicenseAddress();
                ccAddress = defaultEmailSendFrom;
            }
            sendEmail(user.getEmail(), defaultEmailSendFrom, ccAddress, subject, body, null, false, false);
            addUserMailsRecord(user, mailType, defaultEmailSendFrom, StringUtils.isNotEmpty(sendBy) ? sendBy : "Through slack, unknown sender");
            log.info("Sent email to User '{}'", user.getEmail());
        } catch (MailException | MessagingException e) {
            log.warn("Email could not be sent to user '{}'", user.getEmail(), e);
        }
    }

    @Async
    public void sendEmailFromTemplate(UserDTO user, MailType mailType, String subject, String from, String cc, String by, Context additionalContext) {
        sendEmailFromTemplate(user, mailType, subject, user.getEmail(), from, cc, by, additionalContext);
    }

    @Async
    public void sendEmailFromTemplate(UserDTO user, MailType mailType, String subject, String to, String from, String cc, String by, Context additionalContext) {
        if (user.getEmail() == null) {
            log.debug("Email doesn't exist for user '{}'", user.getLogin());
            return;
        }
        Locale locale = Locale.forLanguageTag(user.getLangKey());
        Context context = new Context(locale);
        context.setVariable(USER, user);
        context.setVariable(BASE_URL, jHipsterProperties.getMail().getBaseUrl());

        // Merge the additional context
        if (additionalContext != null)
            additionalContext.getVariableNames().forEach(name -> context.setVariable(name, additionalContext.getVariable(name)));

        String content = templateEngine.process("mail/" + mailType.getTemplateName(), context);
        try {
            if (from == null) {
                from = jHipsterProperties.getMail().getFrom();
            }
            if (by == null) {
                by = from;
            }
            List<String> attachmentFileNames = (mailType == null || !mailType.getAttachmentFileNames().isPresent()) ? null : Arrays.asList(StringUtils.split(mailType.getAttachmentFileNames().get(), ",")).stream().map(item -> item.trim()).collect(Collectors.toList());
            sendEmail(to, from, cc, subject, content, attachmentFileNames, attachmentFileNames != null && attachmentFileNames.size() != 0, true);
            if (to.equals(user.getEmail())) {
                addUserMailsRecord(user, mailType, from, by);
                log.info("Sent email to User '{}'", user.getEmail());
            }
        } catch (MailException | MessagingException e) {
            log.warn("Email could not be sent to user '{}'", user.getEmail(), e);
        }
    }

    public void sendInternalEmailFromTemplate(MailType mailType, String subject, String to, Context additionalContext) {
        Context context = new Context(Locale.ENGLISH);

        if (additionalContext != null)
            additionalContext.getVariableNames().forEach(name -> context.setVariable(name, additionalContext.getVariable(name)));

        String from = jHipsterProperties.getMail().getFrom();
        String content = templateEngine.process("mail/" + mailType.getTemplateName(), context);
        try {
            sendEmail(to, from, null, subject, content, null, false, true);
        } catch (MailException | MessagingException e) {
            log.warn("Internal email could not be sent to '{}'", to, e);
        }
    }

    @Async
    public void sendActivationEmail(UserDTO user) {
        log.debug("Sending activation email to '{}'", user.getEmail());
        sendEmailFromTemplate(user, MailType.ACTIVATION);
    }

    @Async
    public void sendCreationEmail(UserDTO user) {
        log.debug("Sending creation email to '{}'", user.getEmail());
        sendEmailFromTemplate(user, MailType.CREATION);
    }

    @Async
    public void sendApprovalEmail(UserDTO user) {
        log.debug("Sending approval email to '{}'", user.getEmail());
        sendEmailFromTemplate(user, MailType.APPROVAL);
    }

    @Async
    public void sendApiAccessApprovalEmail(UserDTO user) {
        log.debug("Sending approval email to '{}'", user.getEmail());
        sendEmailFromTemplate(user, MailType.API_ACCESS_APPROVAL);
    }

    // This method should be used when we want to explain to the user that their
    // company has a different license type and they've been approved to use that.
    @Async
    public void sendApprovalWithClarificationEmail(UserDTO userDTO, LicenseType registeredLicenseType, Company company) {
        log.debug("Sending approval email with clarification to '{}", userDTO.getEmail());

        Context context = new Context();
        context.setVariable(MAIL_LICENSE, registeredLicenseType.getName());
        context.setVariable("companyName", company.getName());
        context.setVariable("companyLicenseType", company.getLicenseType().getShortName());
        sendEmailFromTemplate(userDTO, MailType.APPROVAL_ALIGN_LICENSE_WITH_COMPANY, context);
    }

    @Async
    public void sendPasswordResetMail(UserDTO user) {
        log.debug("Sending password reset email to '{}'", user.getEmail());
        sendEmailFromTemplate(user, MailType.PASSWORD_RESET);
    }

    @Async
    public void sendActiveTrialMail(UserDTO user, Boolean newAccountCreation) {
        log.debug("Sending password reset email to '{}'", user.getEmail());

        Context context = new Context();
        context.setVariable("newAccountCreation", newAccountCreation);
        sendEmailFromTemplate(user, MailType.ACTIVATE_FREE_TRIAL, context);
    }

    @Async
    public void sendAcademicClarificationEmail(UserDTO user) {
        sendEmailWithLicenseContext(user, MailType.CLARIFY_ACADEMIC_NON_INSTITUTE_EMAIL, applicationProperties.getEmailAddresses().getRegistrationAddress(), null, null);
    }

    @Async
    public void sendTrialAccountExpiresMail(int expiresInDays, List<UserDTO> users) {
        if (users == null || users.isEmpty()) {
            return;
        }
        Context context = new Context(Locale.US);
        context.setVariable("users", users);
        context.setVariable(BASE_URL, jHipsterProperties.getMail().getBaseUrl());
        context.setVariable(EXPIRE_IN_DAYS, expiresInDays);

        for (UserDTO user : users) {
            addUserMailsRecord(user, TRIAL_ACCOUNT_IS_ABOUT_TO_EXPIRE, applicationProperties.getEmailAddresses().getLicenseAddress(), "bot");
        }

        String content = templateEngine.process("mail/" + TRIAL_ACCOUNT_IS_ABOUT_TO_EXPIRE.getTemplateName(), context);

        try {
            sendEmail(applicationProperties.getEmailAddresses().getLicenseAddress(), applicationProperties.getEmailAddresses().getLicenseAddress(), null, "The list of expiring trial OncoKB accounts", content, null, false, true);
            log.info("Sent email to User '{}'", applicationProperties.getEmailAddresses().getLicenseAddress());
        } catch (MailException | MessagingException e) {
            log.warn("Email could not be sent to user '{}'", applicationProperties.getEmailAddresses().getTechDevAddress(), e);
        }
    }

    @Async
    public void sendExposedTokensInfoMail(List<ExposedToken> exposedTokens, List<ExposedToken> tokensToVerify) {
        Context context = new Context(Locale.US);
        context.setVariable("exposedTokens", exposedTokens);
        context.setVariable("tokensToVerify", tokensToVerify);
        context.setVariable(BASE_URL, jHipsterProperties.getMail().getBaseUrl());
        String content = templateEngine.process("mail/" + TOKEN_HAS_BEEN_EXPOSED.getTemplateName(), context);

        try {
            sendEmail(applicationProperties.getEmailAddresses().getTechDevAddress(), applicationProperties.getEmailAddresses().getTechDevAddress(), null, "Exposed tokens", content, null, false, true);
            log.info("Sent email to User '{}'", applicationProperties.getEmailAddresses().getTechDevAddress());
        } catch (MailException | MessagingException e) {
            log.warn("Email could not be sent to user '{}'", applicationProperties.getEmailAddresses().getTechDevAddress(), e);
        }
    }

    @Async
    public void sendMailWhenSearchingStructrueChange(String source) {
        Context context = new Context(Locale.US);
        context.setVariable("source", source);
        context.setVariable(BASE_URL, jHipsterProperties.getMail().getBaseUrl());
        String content = templateEngine.process("mail/" + SEARCHING_RESPONSE_STRUCTURE_HAS_CHANGED.getTemplateName(), context);
        try {
            sendEmail(applicationProperties.getEmailAddresses().getTechDevAddress(), applicationProperties.getEmailAddresses().getTechDevAddress(), null, "Searching Response Structure Has Changed", content, null, false, true);
            log.info("Sent email to User '{}'", applicationProperties.getEmailAddresses().getTechDevAddress());
        } catch (MailException | MessagingException e) {
            log.warn("Email could not be sent to user '{}'", applicationProperties.getEmailAddresses().getTechDevAddress(), e);
        }
    }

    @Async
    public void sendMailToUserWhenTokenExposed(UserDTO user, ExposedToken token) {
        Context context = new Context(Locale.US);
        context.setVariable("token", token);
        sendEmailFromTemplate(user, MailType.TOKEN_HAS_BEEN_EXPOSED_USER, "OncoKB Token exposed",
            applicationProperties.getEmailAddresses().getTechDevAddress(), applicationProperties.getEmailAddresses().getTechDevAddress(), null, context);
    }

    @Async
    public void sendUnapprovedUsersEmail(int daysAgo, List<UserMessagePair> users){
        if (users == null || users.isEmpty()) {
            return;
        }

        users.sort(Comparator.comparingDouble(user -> Objects.nonNull(user.getMessage().getLatestReply()) ? Double.parseDouble(user.getMessage().getLatestReply()) : 0));

        List<UserMessagePair> commercialUsers = users.stream().filter(user -> user.getUserDTO().getLicenseType() != null && !user.getUserDTO().getLicenseType().equals(LicenseType.ACADEMIC)).collect(Collectors.toList());
        for (UserMessagePair user : commercialUsers) {
            users.remove(user);
        }

        Context context = new Context(Locale.US);
        context.setVariable("commercialUsers", commercialUsers);
        context.setVariable("academicUsers", users);
        context.setVariable("daysAgo", daysAgo);
        context.setVariable(BASE_URL, jHipsterProperties.getMail().getBaseUrl());
        context.setVariable("slackBaseUrl", applicationProperties.getSlack().getSlackBaseUrl());
        context.setVariable("channelId", applicationProperties.getSlack().getUserRegistrationChannelId());

        String content = templateEngine.process("mail/" + LIST_OF_UNAPPROVED_USERS.getTemplateName(), context);

        try {
            sendEmail(applicationProperties.getEmailAddresses().getLicenseAddress(), applicationProperties.getEmailAddresses().getLicenseAddress(), null, "The list of unapproved OncoKB users", content, null, false, true);
            log.info("Sent email to User '{}'", applicationProperties.getEmailAddresses().getLicenseAddress());
        } catch (MailException | MessagingException e) {
            log.warn("Email could not be sent to user '{}'", applicationProperties.getEmailAddresses().getLicenseAddress(), e);
        }
    }

    public List<String> getMailFrom() {
        List<String> mailFrom = new ArrayList<>();
        mailFrom.add(applicationProperties.getEmailAddresses().getRegistrationAddress());
        mailFrom.add(applicationProperties.getEmailAddresses().getLicenseAddress());
        mailFrom.add(applicationProperties.getEmailAddresses().getContactAddress());
        return mailFrom;
    }
}
