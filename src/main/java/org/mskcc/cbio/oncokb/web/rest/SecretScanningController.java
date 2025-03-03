package org.mskcc.cbio.oncokb.web.rest;

import java.lang.reflect.Type;
import java.security.InvalidKeyException;
import java.security.KeyFactory;
import java.security.NoSuchAlgorithmException;
import java.security.PublicKey;
import java.security.Signature;
import java.security.SignatureException;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.X509EncodedKeySpec;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import javax.mail.MessagingException;

import org.apache.commons.codec.binary.Base64;
import org.mskcc.cbio.oncokb.service.MailService;
import org.mskcc.cbio.oncokb.service.S3Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.google.common.reflect.TypeToken;
import com.google.gson.Gson;

@RestController
@RequestMapping("/api")
public class SecretScanningController {

    private final static String GITHUB_KEYS_URI = "https://api.github.com/meta/public_keys/secret_scanning";

    @Autowired
    private MailService mailService;

    private final Logger log = LoggerFactory.getLogger(S3Service.class);

    @PostMapping(path = "secret-scanning")
    public void receiveExposedTokens(
        @RequestHeader("Github-Public-Key-Signature") String signature,
        @RequestHeader("Github-Public-Key-Identifier") String keyID,
        @RequestBody String exposedTokensString) 
    {
        Gson gson = new Gson();
        Type listType = new TypeToken<ArrayList<ExposedToken>>(){}.getType();
        try {
            boolean isVerified = verifyRequestSignature(exposedTokensString, signature, keyID);
            if (!isVerified) {
                throw new Exception("Invalid secret scanning payload");
            }
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }

        List<ExposedToken> exposedTokensObject = gson.fromJson(exposedTokensString, listType);
        try {
            mailService.sendEmailToDevTeam(
                "Exposed Tokens from GitHub Secret Scanning",
                getExposedTokensEmailBody(exposedTokensObject),
                null,
                false,
                false
            );
        } catch (MessagingException e) {
            log.error("Error sending GitHub secret scanning email", e);
        }
    }

    public boolean verifyRequestSignature(String payload, String signature, String keyID) throws NoSuchAlgorithmException, InvalidKeySpecException, InvalidKeyException, SignatureException {
        if (payload.length() == 0 || signature.length() == 0 || keyID.length() == 0) {
            return false;
        } 

        RestTemplate restTemplate = new RestTemplate();
        GitHubValidationPayload gitHubValidationPayload = restTemplate.getForObject(GITHUB_KEYS_URI, GitHubValidationPayload.class);
        if (gitHubValidationPayload.getPublicKeys() == null) {
            return false;
        }

        GitHubPublicKey publicKey = null;
        for (GitHubPublicKey key : gitHubValidationPayload.getPublicKeys()) {
            if (key.key_identifier == keyID) {
                publicKey = key;
                break;
            }
        }
        if (publicKey == null) {
            return false;
        }

        String publicKeyContent = publicKey.getKey()
            .replace("\n", "")
            .replace("-----BEGIN PUBLIC KEY-----", "")
            .replace("-----END PUBLIC KEY-----", "");
        byte[] publicKeyBytes = Base64.decodeBase64(publicKeyContent);
        X509EncodedKeySpec publicKeySpec = new X509EncodedKeySpec(publicKeyBytes);
        KeyFactory keyFactory = KeyFactory.getInstance("RSA");
        PublicKey pubKey = keyFactory.generatePublic(publicKeySpec);
        Signature verifier = Signature.getInstance("SHA256withRSA");
        verifier.initVerify(pubKey);
        verifier.update(payload.getBytes());
        if (!verifier.verify(Base64.decodeBase64(signature))) {
            return false;
        }

        return true;
    }

    public static String getExposedTokensEmailBody(List<ExposedToken> exposedTokens) {
        List<String> exposedTokenStrings = exposedTokens.stream().map((token) -> token.token).collect(Collectors.toList());
        return "The following exposed tokens were reported by GitHub's secret scanning program:\n\n"
            + String.join("\n", exposedTokenStrings);
    }

    class ExposedToken {
        private String token;
        private String type;
        private String url;
        private String source;
        
        public String getToken() {
            return token;
        }

        public void setToken(String token) {
            this.token = token;
        }

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public String getUrl() {
            return url;
        }

        public void setUrl(String url) {
            this.url = url;
        }

        public String getSource() {
            return source;
        }

        public void setSource(String source) {
            this.source = source;
        }
    }

    class GitHubValidationPayload {
        private List<GitHubPublicKey> publicKeys;
        private boolean is_current;

        public List<GitHubPublicKey> getPublicKeys() {
            return publicKeys;
        }

        public void setPublicKeys(List<GitHubPublicKey> publicKeys) {
            this.publicKeys = publicKeys;
        }

        public boolean isIs_current() {
            return is_current;
        }

        public void setIs_current(boolean is_current) {
            this.is_current = is_current;
        }
    }

    class GitHubPublicKey {
        private String key_identifier;
        private String key;

        public String getKey_identifier() {
            return key_identifier;
        }
        public void setKey_identifier(String key_identifier) {
            this.key_identifier = key_identifier;
        }

        public String getKey() {
            return key;
        }

        public void setKey(String key) {
            this.key = key;
        }
    }
}
