package com.sqlanalyzer.model;

import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Enum representing the rating levels for SQL query analysis.
 */
public enum Rating {
    GREEN("green"),
    AMBER("amber"),
    RED("red");
    
    private final String value;
    
    Rating(String value) {
        this.value = value;
    }
    
    @JsonValue
    public String getValue() {
        return value;
    }
    
    public static Rating fromString(String value) {
        for (Rating rating : Rating.values()) {
            if (rating.value.equalsIgnoreCase(value)) {
                return rating;
            }
        }
        throw new IllegalArgumentException("No constant with value " + value + " found");
    }
}
