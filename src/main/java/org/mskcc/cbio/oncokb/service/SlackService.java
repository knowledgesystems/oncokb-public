package org.mskcc.cbio.oncokb.service;

import com.github.seratch.jslack.Slack;
import com.github.seratch.jslack.api.model.block.ActionsBlock;
import com.github.seratch.jslack.api.model.block.LayoutBlock;
import com.github.seratch.jslack.api.model.block.SectionBlock;
import com.github.seratch.jslack.api.model.block.composition.ConfirmationDialogObject;
import com.github.seratch.jslack.api.model.block.composition.MarkdownTextObject;
import com.github.seratch.jslack.api.model.block.composition.PlainTextObject;
import com.github.seratch.jslack.api.model.block.composition.TextObject;
import com.github.seratch.jslack.api.model.block.element.ButtonElement;
import com.github.seratch.jslack.api.webhook.Payload;
import com.github.seratch.jslack.api.webhook.WebhookResponse;
import com.github.seratch.jslack.app_backend.interactive_messages.payload.BlockActionPayload;
import org.apache.commons.lang3.StringUtils;
import org.mskcc.cbio.oncokb.config.application.ApplicationProperties;
import org.mskcc.cbio.oncokb.domain.enumeration.LicenseType;
import org.mskcc.cbio.oncokb.domain.enumeration.MailType;
import org.mskcc.cbio.oncokb.service.dto.UserDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

import static org.mskcc.cbio.oncokb.config.Constants.MAIL_LICENSE;


/**
 * Service for sending account approval info to slack.
 * <p>
 * We use the {@link Async} annotation to send slack messages asynchronously.
 */
@Service
public class SlackService {

    private final Logger log = LoggerFactory.getLogger(SlackService.class);

    private static final String APPROVE_USER = "approve-user";

    private static final String ACADEMIC_CLARIFICATION_NOTE = "We have sent the clarification email to the user asking why they could not use an institution email to register.";
    private static final String COMMERCIAL_APPROVE_NOTE = "We have sent the intake form automatically.";
    private static final String LICENSED_DOMAIN_APPROVE_NOTE = ":bangbang: *This email domain belongs to a licensed company. Please review and approve accordingly.*";

    private final ApplicationProperties applicationProperties;
    private final MailService mailService;
    private final EmailService emailService;

    public SlackService(ApplicationProperties applicationProperties, MailService mailService, EmailService emailService) {
        this.applicationProperties = applicationProperties;
        this.mailService = mailService;
        this.emailService = emailService;
    }

    @Async
    public void sendUserRegistrationToChannel(UserDTO user) {
        log.debug("Sending notification to admin group that a user has registered a new account");
        if (StringUtils.isEmpty(this.applicationProperties.getUserRegistrationWebhook())) {
            log.debug("\tSkipped, the webhook is not configured");
        } else {
            List<LayoutBlock> layoutBlocks = new ArrayList<>();
            if (user.getLicenseType().equals(LicenseType.ACADEMIC)) {
                boolean withClarificationNote = false;
                if (this.applicationProperties.getAcademicEmailClarifyDomains().size() > 0 &&
                    this.applicationProperties.getAcademicEmailClarifyDomains().stream().filter(domain -> user.getEmail().endsWith(domain)).collect(Collectors.toList()).size() > 0) {
                    withClarificationNote = true;
                    mailService.sendEmailWithLicenseContext(user, MailType.CLARIFY_ACADEMIC_NON_INSTITUTE_EMAIL, applicationProperties.getEmailAddresses().getLicenseAddress(), null, null);
                }
                layoutBlocks = buildAcademicBlocks(user, withClarificationNote);
            } else {
                boolean domainIsLicensed = false;
                List<String> licensedDomains = applicationProperties.getLicensedDomainsList();
                if (!licensedDomains.isEmpty() && licensedDomains.stream().anyMatch(domain -> emailService.getEmailDomain(user.getEmail().toLowerCase()).equals(domain.toLowerCase()))) {
                    domainIsLicensed = true;
                }
                layoutBlocks = buildCommercialApprovalBlocks(user, domainIsLicensed);

                if (!domainIsLicensed) {
                    // Send intake form email
                    MailType intakeEmailMailType = mailService.getIntakeFormMailType(user.getLicenseType());
                    if (intakeEmailMailType != null) {
                        mailService.sendEmailWithLicenseContext(user, intakeEmailMailType, applicationProperties.getEmailAddresses().getLicenseAddress(), applicationProperties.getEmailAddresses().getLicenseAddress(), null);
                    }
                }
            }
            Payload payload = Payload.builder()
                .blocks(layoutBlocks)
                .build();

            Slack slack = Slack.getInstance();
            try {
                WebhookResponse response = slack.send(this.applicationProperties.getUserRegistrationWebhook(), payload);
            } catch (IOException e) {
                log.warn("Failed to send message to slack");
            }
        }
    }

    @Async
    public void sendApprovedConfirmation(UserDTO userDTO, BlockActionPayload blockActionPayload) {
        Payload payload = Payload.builder()
            .text(userDTO.getEmail() + " has been approved and notified by " + blockActionPayload.getUser().getName())
            .build();

        Slack slack = Slack.getInstance();
        try {
            WebhookResponse response = slack.send(blockActionPayload.getResponseUrl(), payload);
        } catch (IOException e) {
            log.warn("Failed to send message to slack");
        }
    }

    @Async
    public void sendApprovedConfirmation(UserDTO userDTO) {
        Payload payload = Payload.builder()
            .text(userDTO.getEmail() + " has been approved and notified automatically")
            .build();

        Slack slack = Slack.getInstance();
        try {
            // This is an automatic message when user from whitelist is registered.
            WebhookResponse response = slack.send(this.applicationProperties.getUserRegistrationWebhook(), payload);
        } catch (IOException e) {
            log.warn("Failed to send message to slack");
        }
    }

    @Async
    public void sendApprovedConfirmationForMSKCommercialRequest(UserDTO userDTO, LicenseType registeredLicenseType) {
        Payload payload = Payload.builder()
            .text(userDTO.getEmail() + " has been approved and notified automatically. We also changed their license to Academic and clarified with the user.")
            .build();

        Slack slack = Slack.getInstance();
        try {
            // This is an automatic message when user from whitelist is registered.
            WebhookResponse response = slack.send(this.applicationProperties.getUserRegistrationWebhook(), payload);
            // In this case, we also want to send an email to user to explain
            Context context = new Context();
            context.setVariable(MAIL_LICENSE, registeredLicenseType.getName());
            mailService.sendEmailFromTemplate(userDTO, MailType.APPROVAL_MSK_IN_COMMERCIAL, context);
        } catch (IOException e) {
            log.warn("Failed to send message to slack");
        }
    }

    public Optional<BlockActionPayload.Action> getApproveUserAction(BlockActionPayload blockActionPayload) {
        return blockActionPayload.getActions().stream().filter(action -> action.getActionId().equalsIgnoreCase(APPROVE_USER)).findFirst();
    }

    private TextObject getTextObject(String title, String content) {
        StringBuilder sb = new StringBuilder();
        sb.append("*" + title + ":*\n");
        sb.append(content);
        return MarkdownTextObject.builder().text(sb.toString()).build();
    }

    private List<LayoutBlock> buildCommercialApprovalBlocks(UserDTO user, boolean domainApproved) {
        List<LayoutBlock> blocks = new ArrayList<>();

        // Add mention
        if (domainApproved) {
            blocks.add(buildChannelMentionBlock());
            blocks.add(SectionBlock.builder().text(MarkdownTextObject.builder().text(LICENSED_DOMAIN_APPROVE_NOTE).build()).build());
        } else {
            // Add intake form note
            blocks.add(buildHereMentionBlock());
        }

        // Add Title
        blocks.add(buildTitleBlock(user));

        // Add user info section
        blocks.add(buildUserInfoBlock(user));

        // Add Approve button
        blocks.add(buildApproveButton(user));

        if (!domainApproved) {
            // Add intake form note
            blocks.add(buildPlainTextBlock(COMMERCIAL_APPROVE_NOTE));
        }

        return blocks;
    }

    private List<LayoutBlock> buildAcademicBlocks(UserDTO user, boolean withClarificationNote) {
        List<LayoutBlock> blocks = new ArrayList<>();

        // Add mention
        blocks.add(buildHereMentionBlock());

        // Add Title
        blocks.add(buildTitleBlock(user));

        // Add user info section
        blocks.add(buildUserInfoBlock(user));

        if(withClarificationNote) {
            // Add clarification note
            blocks.add(buildPlainTextBlock(ACADEMIC_CLARIFICATION_NOTE));
        } else {
            // Add Approve button
            blocks.add(buildApproveButton(user));
        }

        return blocks;
    }

    private LayoutBlock buildHereMentionBlock() {
        return SectionBlock.builder().text(MarkdownTextObject.builder().text("<!here>").build()).build();
    }

    private LayoutBlock buildChannelMentionBlock() {
        return SectionBlock.builder().text(MarkdownTextObject.builder().text("<!channel>").build()).build();
    }

    private LayoutBlock buildTitleBlock(UserDTO user) {
        List<TextObject> title = new ArrayList<>();
        title.add(getTextObject("The following user registered an " + user.getLicenseType() + " account", ""));
        return SectionBlock.builder().fields(title).build();
    }

    private LayoutBlock buildUserInfoBlock(UserDTO user) {
        List<TextObject> userInfo = new ArrayList<>();
        userInfo.add(getTextObject("Email", user.getEmail()));
        userInfo.add(getTextObject("Name", user.getFirstName() + " " + user.getLastName()));
        userInfo.add(getTextObject("Company", user.getCompany()));
        userInfo.add(getTextObject("Job Title", user.getJobTitle()));
        userInfo.add(getTextObject("City", user.getCity()));
        userInfo.add(getTextObject("Country", user.getCountry()));

        return SectionBlock.builder().fields(userInfo).build();
    }

    private LayoutBlock buildApproveButton(UserDTO user) {
        ButtonElement button = ButtonElement.builder()
            .text(PlainTextObject.builder().emoji(true).text("Approve").build())
            .style("primary")
            .actionId(APPROVE_USER)
            .value(user.getLogin())
            .build();
        if (user.getLicenseType() != LicenseType.ACADEMIC) {
            ConfirmationDialogObject confirmationDialogObject = ConfirmationDialogObject.builder()
                .title(PlainTextObject.builder().text("Are you sure?").build())
                .text(PlainTextObject.builder().text("You are going to approve a commercial account.").build())
                .confirm(PlainTextObject.builder().text("Yes").build())
                .deny(PlainTextObject.builder().text("No").build())
                .build();
            button.setConfirm(confirmationDialogObject);
        }
        return ActionsBlock.builder().elements(Arrays.asList(button)).build();
    }

    private LayoutBlock buildPlainTextBlock(String text) {
        return SectionBlock.builder().text(PlainTextObject.builder().text(text).build()).build();
    }
}
