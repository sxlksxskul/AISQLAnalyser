package com.sqlanalyzer.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sqlanalyzer.model.AnalysisResult;
import com.sqlanalyzer.model.Rating;
import dev.langchain4j.model.chat.ChatLanguageModel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Service class responsible for analysing SQL queries using Ollama AI model via Langchain4j.
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
    public List<AnalysisResult> analyseSqlQuery(String sqlQuery) {
        logger.info("Starting analysis for SQL query: {}", sqlQuery);
        System.out.println("=".repeat(80));
        System.out.println("🔍 SQL QUERY ANALYSIS REQUEST");
        System.out.println("=".repeat(80));
        System.out.println("Query: " + sqlQuery);
        System.out.println("-".repeat(80));

        try {
            String prompt = buildAnalysisPrompt(sqlQuery);
            System.out.println("📤 SENDING TO AI MODEL:");
            System.out.println(prompt);
            System.out.println("-".repeat(80));
            
            System.out.println("🤖 CALLING OLLAMA MODEL...");
            long startTime = System.currentTimeMillis();
            String aiResponse = chatLanguageModel.generate(prompt);
            long endTime = System.currentTimeMillis();
            
            System.out.println("📥 AI MODEL RESPONSE (took " + (endTime - startTime) + "ms):");
            System.out.println(aiResponse);
            System.out.println("=".repeat(80));
            
            logger.debug("AI Response: {}", aiResponse);
            
            return parseAiResponse(aiResponse);
            
        } catch (Exception e) {
            logger.error("Error analysing SQL query", e);
            throw new RuntimeException("Failed to analyse SQL query: " + e.getMessage(), e);
        }
    }

    /**
     * Builds the prompt for the AI model to analyse the SQL query.
     */
    private String buildAnalysisPrompt(String sqlQuery) {
        return String.format("""
            Please analyse the following SQL query and provide a structured analysis in JSON format.
            
            SQL Query:
            %s
            
            Please evaluate the query in the following categories and provide the response as a JSON array:
            1. Efficiency - Performance and optimization aspects
            2. Best Practices - Code quality and maintainability
            3. Cost - Resource usage and execution cost
            
            For each category, provide:
            - category: The category name
            - rating: Either "green" (good), "amber" (needs attention), or "red" (poor/problematic)
            - text: Detailed explanation and recommendations (2-3 sentences)
            
            Example response format:
            [
              {
                "category": "Efficiency",
                "rating": "amber",
                "text": "Your analysis here..."
              },
              {
                "category": "Best Practices", 
                "rating": "red",
                "text": "Your analysis here..."
              },
              {
                "category": "Cost",
                "rating": "green", 
                "text": "Your analysis here..."
              }
            ]
            
            Respond ONLY with the JSON array, no additional text or formatting.
            """, sqlQuery);
    }

    /**
     * Parses the AI response and converts it to AnalysisResult objects.
     */
    private List<AnalysisResult> parseAiResponse(String aiResponse) {
        try {
            // Clean the response - remove any markdown formatting or extra text
            String cleanedResponse = cleanJsonResponse(aiResponse);
            
            JsonNode jsonArray = objectMapper.readTree(cleanedResponse);
            List<AnalysisResult> results = new ArrayList<>();

            if (jsonArray.isArray()) {
                for (JsonNode node : jsonArray) {
                    AnalysisResult result = new AnalysisResult();
                    result.setCategory(node.get("category").asText());
                    result.setRating(Rating.fromString(node.get("rating").asText()));
                    result.setText(node.get("text").asText());
                    results.add(result);
                }
            }

            // Validate we have the expected categories
            if (results.size() != 3) {
                logger.warn("Expected 3 analysis categories, got {}", results.size());
            }

            return results;

        } catch (JsonProcessingException e) {
            logger.error("Failed to parse AI response as JSON: {}", aiResponse, e);
            // Return fallback analysis
            return createFallbackAnalysis(aiResponse);
        }
    }

    /**
     * Cleans the AI response to extract valid JSON.
     */
    private String cleanJsonResponse(String response) {
        // Remove markdown code blocks
        response = response.replaceAll("```json\\s*", "");
        response = response.replaceAll("```\\s*", "");
        
        // Find the first [ and last ]
        int startIndex = response.indexOf('[');
        int endIndex = response.lastIndexOf(']');
        
        if (startIndex >= 0 && endIndex > startIndex) {
            response = response.substring(startIndex, endIndex + 1);
        }
        
        return response.trim();
    }

    /**
     * Creates a fallback analysis when JSON parsing fails.
     */
    private List<AnalysisResult> createFallbackAnalysis(String aiResponse) {
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
        
        logger.info("Using fallback analysis due to parsing error. Original response: {}", aiResponse);
        
        return fallbackResults;
    }
}