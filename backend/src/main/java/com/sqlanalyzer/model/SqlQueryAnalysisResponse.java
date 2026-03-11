package com.sqlanalyzer.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

/**
 * Response model containing the complete SQL query analysis results.
 */
public class SqlQueryAnalysisResponse {
    
    @JsonProperty("results")
    private List<AnalysisResult> results;
    
    @JsonProperty("success")
    private boolean success;
    
    @JsonProperty("message")
    private String message;

    @JsonProperty("improvedQuery")
    private String improvedQuery;
    
    public SqlQueryAnalysisResponse() {}
    
    public SqlQueryAnalysisResponse(List<AnalysisResult> results, boolean success, String message) {
        this.results = results;
        this.success = success;
        this.message = message;
    }
    
    public List<AnalysisResult> getResults() {
        return results;
    }
    
    public void setResults(List<AnalysisResult> results) {
        this.results = results;
    }
    
    public boolean isSuccess() {
        return success;
    }
    
    public void setSuccess(boolean success) {
        this.success = success;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }

    public String getImprovedQuery() {
        return improvedQuery;
    }

    public void setImprovedQuery(String improvedQuery) {
        this.improvedQuery = improvedQuery;
    }
}