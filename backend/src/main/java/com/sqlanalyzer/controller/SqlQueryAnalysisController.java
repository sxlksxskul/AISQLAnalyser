package com.sqlanalyzer.controller;

import com.sqlanalyzer.model.AnalysisResult;
import com.sqlanalyzer.model.SqlQueryAnalysisResponse;
import com.sqlanalyzer.model.SqlQueryRequest;
import com.sqlanalyzer.service.SqlQueryAnalysisService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

/**
 * REST Controller for handling SQL query analysis requests.
 */
@RestController
@RequestMapping("/api/sql")
@CrossOrigin(origins = "http://localhost:5173") // Allow CORS for React frontend
public class SqlQueryAnalysisController {

    private static final Logger logger = LoggerFactory.getLogger(SqlQueryAnalysisController.class);
    
    private final SqlQueryAnalysisService analysisService;

    @Autowired
    public SqlQueryAnalysisController(SqlQueryAnalysisService analysisService) {
        this.analysisService = analysisService;
    }

    /**
     * Endpoint to analyse a SQL query.
     * 
     * @param request The SQL query request containing the query to analyse
     * @return ResponseEntity containing the analysis results
     */
    @PostMapping("/analyse")
    public ResponseEntity<SqlQueryAnalysisResponse> analyseSqlQuery(@Valid @RequestBody SqlQueryRequest request) {
        logger.info("Received SQL query analysis request");
        
        try {
            // Validate input
            if (request.getQuery() == null || request.getQuery().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new SqlQueryAnalysisResponse(null, false, "SQL query cannot be empty"));
            }

            // Perform analysis
            List<AnalysisResult> results = analysisService.analyseSqlQuery(request.getQuery());
            
            SqlQueryAnalysisResponse response = new SqlQueryAnalysisResponse(
                results, 
                true, 
                "Analysis completed successfully"
            );

            logger.info("SQL query analysis completed successfully");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Error processing SQL query analysis request", e);
            
            SqlQueryAnalysisResponse errorResponse = new SqlQueryAnalysisResponse(
                null, 
                false, 
                "Failed to analyse SQL query: " + e.getMessage()
            );
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(errorResponse);
        }
    }

    /**
     * Health check endpoint.
     * 
     * @return ResponseEntity indicating service status
     */
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("SQL Query Analyser Backend is running");
    }
}