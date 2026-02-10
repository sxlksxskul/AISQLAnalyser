# SQL Query Analyzer Backend

This is a Java Spring Boot backend service that analyzes SQL queries using the Ollama AI model via Langchain4j integration.

## Prerequisites

1. **Java 17** or higher installed
2. **Maven** for dependency management
3. **Ollama** running locally with a language model

### Setting up Ollama

1. Install Ollama from [https://ollama.ai/](https://ollama.ai/)
2. Pull a language model (e.g., Llama 3):
   ```bash
   ollama pull llama3
   ```
3. Verify Ollama is running:
   ```bash
   ollama list
   ```

## Project Structure

```
backend/
├── src/main/java/com/sqlanalyzer/
│   ├── SqlQueryAnalyzerApplication.java     # Main Spring Boot application
│   ├── config/
│   │   └── OllamaConfig.java               # Ollama configuration
│   ├── controller/
│   │   └── SqlQueryAnalysisController.java # REST API endpoints
│   ├── model/
│   │   ├── AnalysisResult.java            # Analysis result model
│   │   ├── Rating.java                    # Rating enum
│   │   ├── SqlQueryAnalysisResponse.java  # API response model
│   │   └── SqlQueryRequest.java           # API request model
│   └── service/
│       └── SqlQueryAnalysisService.java   # Core analysis logic
├── src/main/resources/
│   └── application.properties             # Configuration settings
└── pom.xml                               # Maven dependencies
```

## Configuration

The application can be configured via `application.properties`:

- `ollama.base-url`: Ollama server URL (default: http://localhost:11434)
- `ollama.model-name`: Model to use (default: llama3)
- `ollama.timeout`: Request timeout in seconds (default: 60)
- `server.port`: Spring Boot server port (default: 8080)

## Building and Running

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Build the project:
   ```bash
   mvn clean compile
   ```

3. Run the application:
   ```bash
   mvn spring-boot:run
   ```

The backend will start on `http://localhost:8080`.

## API Endpoints

### Analyze SQL Query

**POST** `/api/sql/analyze`

Request body:
```json
{
  "query": "SELECT * FROM users WHERE id = 1"
}
```

Response:
```json
{
  "results": [
    {
      "category": "Efficiency",
      "rating": "amber",
      "text": "Analysis of query efficiency..."
    },
    {
      "category": "Best Practices",
      "rating": "green", 
      "text": "Analysis of best practices..."
    },
    {
      "category": "Cost",
      "rating": "green",
      "text": "Analysis of query cost..."
    }
  ],
  "success": true,
  "message": "Analysis completed successfully"
}
```

### Health Check

**GET** `/api/sql/health`

Response: `SQL Query Analyzer Backend is running`

## Integration with Frontend

The backend is configured to accept CORS requests from `http://localhost:5173` (React frontend).

To integrate with your existing React frontend, update the `handleAnalyse` function in `App.tsx` to call the backend API instead of using mock data.

Example integration:
```typescript
const handleAnalyse = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/sql/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });
    
    const data = await response.json();
    if (data.success) {
      // Use data.results instead of mockAnalysis
      setShowResults(true);
    }
  } catch (error) {
    console.error('Error analyzing query:', error);
  }
};
```

## Troubleshooting

1. **Ollama Connection Issues**: Ensure Ollama is running on the correct port (11434 by default)
2. **Model Not Found**: Make sure you've pulled the model specified in configuration (`llama3` by default)
3. **CORS Issues**: Verify the frontend is running on `http://localhost:5173` or update CORS configuration
4. **Slow Responses**: Increase the timeout setting or try a smaller/faster model

## Development

For development, you can use Spring Boot DevTools which is included in the dependencies. The application will automatically restart when changes are detected.