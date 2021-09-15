package org.mskcc.cbio.oncokb.util;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.format.FormatStyle;
import java.util.Locale;

/**
 * Created by Hongxin Zhang on 4/6/21.
 */
public class TimeUtil {
    public static String toSystemDefaultZoneTime(Instant time) {
        DateTimeFormatter formatter =
            DateTimeFormatter.ofLocalizedDateTime(FormatStyle.FULL)
                .withLocale(Locale.US)
                .withZone(ZoneId.systemDefault());
        return formatter.format(time);
    }

    public static String toNYZoneTime(Instant time) {
        DateTimeFormatter formatter =
            DateTimeFormatter.ofLocalizedDateTime(FormatStyle.FULL)
                .withLocale(Locale.US)
                .withZone(ZoneId.of("US/Eastern"));
        return formatter.format(time);
    }
}
