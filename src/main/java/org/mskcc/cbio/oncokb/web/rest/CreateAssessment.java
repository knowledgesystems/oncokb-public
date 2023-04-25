package org.mskcc.cbio.oncokb.web.rest;

import com.google.cloud.recaptchaenterprise.v1.RecaptchaEnterpriseServiceClient;
import com.google.recaptchaenterprise.v1.Assessment;
import com.google.recaptchaenterprise.v1.CreateAssessmentRequest;
import com.google.recaptchaenterprise.v1.Event;
import com.google.recaptchaenterprise.v1.ProjectName;
import java.io.IOException;

import org.mskcc.cbio.oncokb.config.application.ApplicationProperties;
import org.mskcc.cbio.oncokb.config.application.RecaptchaProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.naming.ConfigurationException;
import javax.servlet.http.HttpServletRequest;
import javax.xml.bind.ValidationException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

@Component
public class CreateAssessment {

  private static final Logger LOGGER = LoggerFactory.getLogger(CreateAssessment.class);

  public static String RECAPTCHA_VALIDATION_ERROR = "Validation failed";
  public static String RECAPTCHA_TOKEN_ERROR = "Unable to retrieve recaptcha token. Please try again.";
  public static String RECAPTCHA_CONFIGURATION_ERROR = "Recaptcha configuration is not set up. Recaptcha protection is now disabled.";

  static RecaptchaProperties recaptchaProperties;

  public CreateAssessment(ApplicationProperties applicationProperties) {
    this.recaptchaProperties = applicationProperties.getRecaptcha();
  }

  public String getRecaptchaToken(HttpServletRequest request) throws ValidationException {
    String recaptchaToken = request.getHeader("g-recaptcha-response");
    if (recaptchaToken == null) {
      throw new ValidationException(RECAPTCHA_TOKEN_ERROR);
    } else {
      return recaptchaToken;
    }
  }

  public RecaptchaEnterpriseServiceClient createClient() throws ValidationException, ConfigurationException {
    if (recaptchaProperties.getSiteKey() == null || recaptchaProperties.getProjectId() == null || recaptchaProperties.getThreshold() == null) {
      throw new ConfigurationException(RECAPTCHA_CONFIGURATION_ERROR);
    }
    try {
      RecaptchaEnterpriseServiceClient client = RecaptchaEnterpriseServiceClient.create();
      return client;
    } catch (Exception e) {
      e.printStackTrace();
      throw new ValidationException(RECAPTCHA_VALIDATION_ERROR);
    }
  }

  public ResponseEntity<String> createAssessment(RecaptchaEnterpriseServiceClient client, String recaptchaToken)
      throws IOException, ValidationException {
        Event event = Event.newBuilder().setSiteKey(recaptchaProperties.getSiteKey()).setToken(recaptchaToken).build();

      // Build the assessment request.
      CreateAssessmentRequest createAssessmentRequest = CreateAssessmentRequest.newBuilder()
          .setParent(ProjectName.of(recaptchaProperties.getProjectId()).toString())
          .setAssessment(Assessment.newBuilder().setEvent(event).build())
          .build();

      Assessment response = client.createAssessment(createAssessmentRequest);

      client.close();
      LOGGER.info("my site key " + recaptchaProperties.getSiteKey());

      // Check if the token is valid.
      if (response.getTokenProperties().getValid()
          && response.getRiskAnalysis().getScore() >= recaptchaProperties.getThreshold()) {
        LOGGER.info("RECAPTCHA TOKEN VERIFIED SUCCESSFULLY. SCORE: " + response.getRiskAnalysis().getScore());
        return new ResponseEntity<>("Recaptcha successfully validated", HttpStatus.OK);
      } else {
        LOGGER.info(
            "The CreateAssessment call failed because the token was: "
                + response.getTokenProperties().getInvalidReason().name());
        throw new ValidationException(RECAPTCHA_VALIDATION_ERROR);
      }
  }
}