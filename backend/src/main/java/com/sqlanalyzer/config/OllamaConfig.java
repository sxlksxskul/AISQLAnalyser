package com.sqlanalyzer.config;

import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.ollama.OllamaChatModel;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;

/**
 * Configuration class for setting up Langchain4j with Ollama integration.
 */
@Configuration
public class OllamaConfig {

    @Value("${ollama.base-url:http://localhost:11434}")
    private String ollamaBaseUrl;

    @Value("${ollama.model-name:llama3}")
    private String modelName;

    @Value("${ollama.timeout:60}")
    private int timeoutSeconds;

    /**
     * Creates and configures the Ollama chat model bean.
     * 
     * @return ChatLanguageModel configured for Ollama
     */
    @Bean
    public ChatLanguageModel chatLanguageModel() {
        return OllamaChatModel.builder()
                .baseUrl(ollamaBaseUrl)
                .modelName(modelName)
                .timeout(Duration.ofSeconds(timeoutSeconds))
                .temperature(0.1) // Lower temperature for more consistent analysis
                .build();
    }
}