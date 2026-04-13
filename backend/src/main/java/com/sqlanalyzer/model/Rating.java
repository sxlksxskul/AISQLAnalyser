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
        // Handle null or empty values
        if (value == null || value.isEmpty()) {
            return AMBER; // Default to AMBER
        }
        
        String lowerValue = value.toLowerCase().trim();
        
        // Try exact match first
        for (Rating rating : Rating.values()) {
            if (rating.value.equalsIgnoreCase(lowerValue)) {
                return rating;
            }
        }
        
        // Try to match partial/similar values
        if (lowerValue.contains("green") || lowerValue.contains("pass") || lowerValue.contains("good")) {
            return GREEN;
        }
        if (lowerValue.contains("red") || lowerValue.contains("fail") || lowerValue.contains("critical")) {
            return RED;
        }
        if (lowerValue.contains("yellow") || lowerValue.contains("warn") || lowerValue.contains("amber") || lowerValue.contains("caution")) {
            return AMBER;
        }
        
        // Default to AMBER if no match found
        return AMBER;
    }
}