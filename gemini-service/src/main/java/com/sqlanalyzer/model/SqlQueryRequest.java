package com.sqlanalyzer.model;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Request model for SQL query analysis.
 */
public class SqlQueryRequest {
    
    @JsonProperty("query")
    private String query;
    
    public SqlQueryRequest() {}
    
    public SqlQueryRequest(String query) {
        this.query = query;
    }
    
    public String getQuery() {
        return query;
    }
    
    public void setQuery(String query) {
        this.query = query;
    }
}
