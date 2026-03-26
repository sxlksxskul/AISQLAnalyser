package com.sqlanalyzer.model;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Individual analysis result for a specific category.
 */
public class AnalysisResult {
    
    @JsonProperty("category")
    private String category;
    
    @JsonProperty("rating")
    private Rating rating;
    
    @JsonProperty("text")
    private String text;
    
    public AnalysisResult() {}
    
    public AnalysisResult(String category, Rating rating, String text) {
        this.category = category;
        this.rating = rating;
        this.text = text;
    }
    
    public String getCategory() {
        return category;
    }
    
    public void setCategory(String category) {
        this.category = category;
    }
    
    public Rating getRating() {
        return rating;
    }
    
    public void setRating(Rating rating) {
        this.rating = rating;
    }
    
    public String getText() {
        return text;
    }
    
    public void setText(String text) {
        this.text = text;
    }
}
