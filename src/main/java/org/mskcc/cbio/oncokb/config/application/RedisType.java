package org.mskcc.cbio.oncokb.config.application;

/**
 * Created by Hongxin Zhang on 12/2/19.
 */
public enum RedisType {
    SINGLE("single"),
    SENTINEL("sentinel");

    private final String type;

    RedisType(String type) {
        this.type = type;
    }

    public String getType() {
        return type;
    }
}
