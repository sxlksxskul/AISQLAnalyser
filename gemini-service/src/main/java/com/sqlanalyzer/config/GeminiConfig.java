package com.sqlanalyzer.config;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.data.message.ChatMessage;
import dev.langchain4j.data.message.UserMessage;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.output.Response;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.HashMap;
import java.util.Map;

/**
 * Configuration class for setting up Google Gemini API integration.
 * Uses REST API calls to the Gemini API directly.
 */
@Configuration
public class GeminiConfig {
    
    private static final Logger logger = LoggerFactory.getLogger(GeminiConfig.class);

    @Value("${gemini.api-key}")
    private String geminiApiKey;

    @Value("${gemini.model-name:gemini-1.5-flash}")
    private String modelName;

    /**
     * Creates and configures the Gemini chat model bean as a custom ChatLanguageModel implementation.
     */
    @Bean
    public ChatLanguageModel chatLanguageModel() {
        return new ChatLanguageModel() {
            private final RestTemplate restTemplate = new RestTemplate();
            private final ObjectMapper objectMapper = new ObjectMapper();

            @Override
            public Response<AiMessage> generate(List<ChatMessage> messages) {
                try {
                    logger.debug("Generating content with Gemini model: {}", modelName);
                    
                    // Extract user message from chat messages
                    String userMessage = "";
                    for (ChatMessage msg : messages) {
                        if (msg instanceof UserMessage) {
                            userMessage = ((UserMessage) msg).singleText();
                            break;
                        }
                    }
                    
                    String url = "https://generativelanguage.googleapis.com/v1beta/models/" + 
                                modelName + ":generateContent?key=" + geminiApiKey;
                    
                    // Build request payload
                    Map<String, Object> payload = new HashMap<>();
                    Map<String, Object> contents = new HashMap<>();
                    Map<String, String> parts = new HashMap<>();
                    parts.put("text", userMessage);
                    contents.put("parts", new Object[]{parts});
                    payload.put("contents", new Object[]{contents});
                    
                    // Call Gemini API
                    String responseBody = restTemplate.postForObject(url, payload, String.class);
                    
                    // Parse response
                    String aiResponse = parseGeminiResponse(responseBody);
                    logger.debug("Successfully generated content from Gemini");
                    
                    return Response.from(new AiMessage(aiResponse));
                } catch (Exception e) {
                    logger.error("Failed to generate content with Gemini: ", e);
                    throw new RuntimeException("Failed to generate content with Gemini: " + e.getMessage(), e);
                }
            }
            
            private String parseGeminiResponse(String responseBody) throws Exception {
                JsonNode root = objectMapper.readTree(responseBody);
                JsonNode candidates = root.get("candidates");
                
                if (candidates != null && candidates.isArray() && candidates.size() > 0) {
                    JsonNode content = candidates.get(0).get("content");
                    if (content != null) {
                        JsonNode parts_array = content.get("parts");
                        if (parts_array != null && parts_array.isArray() && parts_array.size() > 0) {
                            JsonNode text = parts_array.get(0).get("text");
                            if (text != null) {
                                return text.asText();
                            }
                        }
                    }
                }
                logger.warn("Empty response from Gemini");
                return "";
            }
        };
    }
}



