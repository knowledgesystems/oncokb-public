package org.mskcc.cbio.oncokb.domain.enumeration;

public enum TokenType {
    USER("okbu"),
    SERVICE("okbs");

    String type;

    TokenType(String type) {
        this.type = type;
    }

    public String getType() {
        return this.type;
    }
}
