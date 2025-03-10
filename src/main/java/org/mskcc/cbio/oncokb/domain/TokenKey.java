package org.mskcc.cbio.oncokb.domain;

import java.io.Serializable;
import java.security.SecureRandom;
import java.util.zip.CRC32;

import org.apache.commons.lang3.StringUtils;
import org.mskcc.cbio.oncokb.domain.enumeration.TokenType;

public class TokenKey implements Serializable {
    public static int TOKEN_CHAR_LENGTH = 30;

    public static int CHECKSUM_CHAR_LENGTH = 6;

    private static String BASE62_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    private TokenType tokenType;

    private String token;

    private String checksum;

    public static TokenKey generate(TokenType type) {
        TokenKey tokenKey = new TokenKey();
        tokenKey.setTokenType(type);

        String token = generateToken();
        tokenKey.setToken(token);
        tokenKey.setChecksum(generateChecksum(token));

        return tokenKey;
    }

    public boolean validate() {
        return generateChecksum(token).equals(this.checksum);
    }

    private static String generateToken() {
        SecureRandom secureRandom = new SecureRandom();
        StringBuilder token = new StringBuilder();
        for (int i = 0; i < TOKEN_CHAR_LENGTH; i++) {
            token.append(BASE62_CHARS.charAt(secureRandom.nextInt(BASE62_CHARS.length())));
        }
        return token.toString();
    }

    public static String generateChecksum(String token) {
        CRC32 crc32 = new CRC32();
        crc32.update(token.getBytes());
        String base62Checksum = toBase62(crc32.getValue());
        if (base62Checksum.length() < CHECKSUM_CHAR_LENGTH) {
            base62Checksum = StringUtils.repeat('0', CHECKSUM_CHAR_LENGTH - base62Checksum.length()) + base62Checksum;
        }
        return base62Checksum;
    }

    private static String toBase62(long val) {
        StringBuffer sb = new StringBuffer();
        while(val > 0) {
            int remainder = (int) (val % 62);
            val = val / 62;
            sb.insert(0, BASE62_CHARS.charAt((int) remainder));
        }
        return sb.toString();
    }

    public TokenType getTokenType() {
        return tokenType;
    }

    public void setTokenType(TokenType tokenType) {
        this.tokenType = tokenType;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getChecksum() {
        return checksum;
    }

    public void setChecksum(String checksum) {
        this.checksum = checksum;
    }

    public String getFullToken() {
        return this.tokenType.getType() + "_" + this.token + this.checksum;
    }
}