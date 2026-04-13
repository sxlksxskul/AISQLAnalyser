package com.sqlanalyzer.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sqlanalyzer.model.AnalysisResult;
import com.sqlanalyzer.model.Rating;
import com.sqlanalyzer.model.SqlQueryAnalysisResponse;
import dev.langchain4j.model.chat.ChatLanguageModel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Service class responsible for analysing SQL queries using Google Gemini AI model via Langchain4j.
 */
@Service
public class SqlQueryAnalysisService {

    private static final Logger logger = LoggerFactory.getLogger(SqlQueryAnalysisService.class);

    private final ChatLanguageModel chatLanguageModel;
    private final ObjectMapper objectMapper;

    @Autowired
    public SqlQueryAnalysisService(ChatLanguageModel chatLanguageModel) {
        this.chatLanguageModel = chatLanguageModel;
        this.objectMapper = new ObjectMapper();
    }

    /**
     * Analyses a SQL query and returns structured analysis results.
     *
     * @param sqlQuery The SQL query to analyse
     * @return List of analysis results
     * @throws RuntimeException if analysis fails
     */
    public SqlQueryAnalysisResponse analyseSqlQuery(String sqlQuery) {
        try {
            String prompt = buildAnalysisPrompt(sqlQuery);
            String aiResponse = chatLanguageModel.generate(prompt);
            return parseAiResponse(aiResponse);
            
        } catch (Exception e) {
            throw new RuntimeException("Failed to analyse SQL query: " + e.getMessage(), e);
        }
    }

    /**
     * Builds the prompt for the AI model to analyse the SQL query.
     */
    private String buildAnalysisPrompt(String sqlQuery) {
        return String.format("""
            SYSTEM: 
            You are an expert SQL Performance Auditor. Your goal is to analyse SQL queries and provide structured feedback in JSON format.

            ### CORE OPERATING RULES:
            1. D-CoT PROTOCOL: You must provide a "reasoning" trace for every category. This trace must explicitly IDENTIFY the SQL structure, EVALUATE it against DB logic, and CONCLUDE the rating.
            2. SCHEMA VALIDATION: Refer to the provided DATABASE SCHEMA CONTEXT. If a table/column is missing, flag it as 'Unknown' in the Best Practices section.
            3. NEGATIVE CONSTRAINT: Only report errors actually present. Do not repeat errors from the demonstrations if they do not exist in the user's query.

            ### DATABASE SCHEMA CONTEXT:
            The following tables are available in the system:
            - CLUB (id, name, city, address, email, contact, website)
            - TRAINER (BIB, first_name, last_name, date_of_birth, phone_number, club_id)
            - TRAINER_LICENSE (id, type, description, trainer_BIB)
            - ATHLETE (BIB, first_name, last_name, date_of_birth, club_id)
            - MEDICAL_CLEARANCE (id, exam_date, expiration_date, comment, athlete_BIB)
            - JUDGE (BIB, first_name, last_name, date_of_birth)
            - COMPETITION (id, name, date, location, category, competition_format, competition_capacity, competition_director, entry_fee, club_id)
            - ATHLETE_COMPETITION (athlete_BIB, competition_id, category, qualification_result, rank_achieved)
            - JUDGE_COMPETITION (judge_BIB, competition_id, report)

            ### DEMONSTRATIONS (CoT-Delivering Examples):

            User Input: "SELECT * FROM CLUB WHERE city = 'Dublin';"
            Assistant Response:
            {
                "analysis": [
                    {
                        "category": "Efficiency",
                        "reasoning": "IDENTIFY: 'SELECT *' wildcard. EVALUATE: This retrieves every column in the 'CLUB' table (7 columns). CONCLUDE: This is inefficient for I/O and prevents covering index usage.",
                        "rating": "amber",
                        "text": "Using SELECT * is inefficient as it retrieves columns like 'address' and 'website' which may not be needed, increasing data transfer overhead."
                    },
                    {
                        "category": "Best Practices",
                        "reasoning": "IDENTIFY: 'SELECT *'. EVALUATE: This is a classic anti-pattern that makes code fragile to schema changes. CONCLUDE: Mark as Red.",
                        "rating": "red",
                        "text": "Anti-pattern: Wildcard selectors should be replaced with explicit column names to ensure application stability and readability."
                    },
                    {
                        "category": "Cost",
                        "reasoning": "IDENTIFY: Single table scan. EVALUATE: Low volume for the CLUB table. CONCLUDE: Minimal cost impact.",
                        "rating": "green",
                        "text": "The resource cost for this query is low due to the small size of the reference table."
                    },
                    {
                        "category": "Security",
                        "reasoning": "IDENTIFY: Static query. EVALUATE: No variables or concatenation. CONCLUDE: Secure.",
                        "rating": "green",
                        "text": "No immediate security risks identified in this static statement."
                    }
                ],
                "improved_query": "SELECT id, name, city FROM CLUB WHERE city = 'Dublin';"
            }

            ### OUTPUT FORMAT:
            Return ONLY a JSON object containing the "analysis" array and the "improved_query" string. Use British English.

            USER SQL QUERY TO ANALYSE: %s
            """, sqlQuery);
    }

    /**
     * Parses the AI response and converts it to a SqlQueryAnalysisResponse.
     */
    private SqlQueryAnalysisResponse parseAiResponse(String aiResponse) {
        try {
            logger.debug("RAW AI RESPONSE FROM GEMINI: {}", aiResponse);
            String cleanedResponse = cleanJsonResponse(aiResponse);
            logger.debug("CLEANED JSON RESPONSE: {}", cleanedResponse);
            JsonNode root = objectMapper.readTree(cleanedResponse);
            List<AnalysisResult> results = new ArrayList<>();

            JsonNode analysisNode = root.get("analysis");
            String improvedQuery = null;
            if (root.has("improved_query") && !root.get("improved_query").isNull()) {
                improvedQuery = root.get("improved_query").asText();
            }

            if (analysisNode != null && analysisNode.isArray()) {
                for (JsonNode node : analysisNode) {
                    if (node.get("category") == null || node.get("rating") == null || node.get("text") == null) {
                        continue;
                    }
                    AnalysisResult result = new AnalysisResult();
                    result.setCategory(node.get("category").asText());
                    result.setRating(Rating.fromString(node.get("rating").asText()));
                    result.setText(node.get("text").asText());
                    results.add(result);
                }
            }

            // Return whatever was parsed, even if less than 4 categories
            if (results.isEmpty()) {
                return createFallbackAnalysis();
            }

            SqlQueryAnalysisResponse response = new SqlQueryAnalysisResponse();
            response.setResults(results);
            response.setImprovedQuery(improvedQuery);
            return response;

        } catch (JsonProcessingException e) {
            logger.error("ERROR PARSING GEMINI AI RESPONSE: {}", e.getMessage(), e);
            return createFallbackAnalysis();
        }
    }

    /**
     * Cleans the AI response to extract valid JSON.
     */
    private String cleanJsonResponse(String response) {
        // Remove markdown code blocks
        response = response.replaceAll("```json\\s*", "");
        response = response.replaceAll("```\\s*", "");
        
        // Find the outermost JSON object
        int startIndex = response.indexOf('{');
        int endIndex = response.lastIndexOf('}');
        
        if (startIndex >= 0 && endIndex > startIndex) {
            response = response.substring(startIndex, endIndex + 1);
        }
        
        return response.trim();
    }

    /**
     * Creates a fallback analysis when JSON parsing fails.
     */
    private SqlQueryAnalysisResponse createFallbackAnalysis() {
        List<AnalysisResult> fallbackResults = new ArrayList<>();
        
        fallbackResults.add(new AnalysisResult(
            "Efficiency", 
            Rating.AMBER, 
            "Unable to parse detailed efficiency analysis. The AI provided feedback but it needs manual review."
        ));
        
        fallbackResults.add(new AnalysisResult(
            "Best Practices", 
            Rating.AMBER, 
            "Unable to parse detailed best practices analysis. Please review the query manually for standard SQL practices."
        ));
        
        fallbackResults.add(new AnalysisResult(
            "Cost", 
            Rating.AMBER, 
            "Unable to parse detailed cost analysis. Consider query execution plan and indexing strategies."
        ));
        
        fallbackResults.add(new AnalysisResult(
            "Security", 
            Rating.AMBER, 
            "Unable to parse detailed security analysis. Please review the query for potential security vulnerabilities."
        ));

        SqlQueryAnalysisResponse response = new SqlQueryAnalysisResponse();
        response.setResults(fallbackResults);
        response.setImprovedQuery(null);
        return response;
    }
}
