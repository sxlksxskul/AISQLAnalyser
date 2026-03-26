package com.sqlanalyzer.controller;

import com.sqlanalyzer.model.AnalysisResult;
import com.sqlanalyzer.model.SqlQueryAnalysisResponse;
import com.sqlanalyzer.model.SqlQueryRequest;
import com.sqlanalyzer.service.SqlQueryAnalysisService;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

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
            SqlQueryAnalysisResponse response = analysisService.analyseSqlQuery(request.getQuery());
            response.setSuccess(true);
            response.setMessage("Analysis completed successfully");

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
        return ResponseEntity.ok("SQL Query Analyser Gemini Backend is running");
    }

    /**
     * Test endpoint to verify AI model communication.
     * This will log the full AI conversation to the console.
     */
    @GetMapping("/test-ai")
    public ResponseEntity<String> testAiCommunication() {
        logger.info("🧪 AI Communication Test Endpoint Called");
        
        String testQuery = "SELECT u.name, COUNT(o.id) as order_count FROM users u LEFT JOIN orders o ON u.id = o.user_id GROUP BY u.name ORDER BY order_count DESC LIMIT 5";
        
        try {
            System.out.println("\n" + "🧪".repeat(40));
            System.out.println("AI COMMUNICATION TEST STARTED");
            System.out.println("🧪".repeat(40));
            
            SqlQueryAnalysisResponse testResponse = analysisService.analyseSqlQuery(testQuery);
            List<AnalysisResult> results = testResponse.getResults();
            
            System.out.println("✅ AI COMMUNICATION TEST COMPLETED SUCCESSFULLY");
            System.out.println("Results count: " + (results != null ? results.size() : 0));
            System.out.println("🧪".repeat(40) + "\n");
            
            return ResponseEntity.ok("AI Communication Test Completed! Check console for detailed logs. Results: " + results.size() + " analysis points.");
        } catch (Exception e) {
            System.out.println("❌ AI COMMUNICATION TEST FAILED");
            System.out.println("Error: " + e.getMessage());
            System.out.println("🧪".repeat(40) + "\n");
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("AI Communication Test Failed: " + e.getMessage());
        }
    }
}
