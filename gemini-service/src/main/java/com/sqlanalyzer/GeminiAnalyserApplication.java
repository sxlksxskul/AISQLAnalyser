package com.sqlanalyzer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.CrossOrigin;

/**
 * Main Spring Boot application class for the SQL Query Analyser Gemini Backend.
 * This application provides REST APIs to analyse SQL queries using Google Gemini AI via Langchain4j.
 */
@SpringBootApplication
@CrossOrigin(origins = "http://localhost:5173") // Allow requests from React frontend
public class GeminiAnalyserApplication {

    public static void main(String[] args) {
        SpringApplication.run(GeminiAnalyserApplication.class, args);
    }
}
