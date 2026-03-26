# Gemini-Service Backend

This is the Google Gemini AI backend service for the SQL Query Analyser. It runs on port 9090 and provides the same REST API as the Ollama backend, but uses Google's Gemini 1.5 Flash model for SQL analysis.

## Prerequisites

1. **Java 17 or higher** - Required for Spring Boot 3.2.1
2. **Maven 3.8.0 or higher** - For building the project
3. **Google Gemini API Key** - Available from [Google AI Studio](https://ai.google.dev/)

## Setup

### 1. Get Your Gemini API Key

Visit [Google AI Studio](https://ai.google.dev/) and create an API key. It's free to use within their free tier limits.

### 2. Set Environment Variable

Before running the service, set the `GEMINI_API_KEY` environment variable:

**On Windows (PowerShell):**
```powershell
$env:GEMINI_API_KEY="your-api-key-here"
```

**On Windows (Command Prompt):**
```cmd
set GEMINI_API_KEY=your-api-key-here
```

**On macOS/Linux:**
```bash
export GEMINI_API_KEY="your-api-key-here"
```

### 3. Build the Project

```bash
mvn clean install
```

### 4. Run the Service

```bash
mvn spring-boot:run
```

The service will start on `http://localhost:9090`

## Testing the Service

Once running, you can test the health endpoint:

```bash
curl http://localhost:9090/api/sql/health
```

Or test the AI analysis:

```bash
curl http://localhost:9090/api/sql/test-ai
```

## API Endpoints

### POST /api/sql/analyse

Analyses a SQL query using Gemini AI.

**Request:**
```json
{
  "query": "SELECT * FROM users WHERE active = true"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Analysis completed successfully",
  "results": [
    {
      "category": "Efficiency",
      "rating": "amber",
      "text": "Using SELECT * retrieves all columns, consider specifying only needed columns."
    },
    {
      "category": "Best Practices",
      "rating": "green",
      "text": "Query structure follows best practices."
    },
    {
      "category": "Cost",
      "rating": "green",
      "text": "Cost-effective query structure."
    },
    {
      "category": "Security",
      "rating": "green",
      "text": "No immediate security risks identified."
    }
  ],
  "improvedQuery": "SELECT id, name, email FROM users WHERE active = true"
}
```

### GET /api/sql/health

Health check endpoint that confirms the service is running.

### GET /api/sql/test-ai

Test endpoint to verify Gemini API communication is working correctly.

## Configuration

The service can be configured via `src/main/resources/application.properties`:

- `server.port=9090` - Port where the service runs
- `gemini.api-key` - Your Gemini API key (from environment variable)
- `gemini.model-name=gemini-1.5-flash` - The Gemini model to use (cheaper and faster)
- `gemini.timeout=60` - Request timeout in seconds
- `gemini.temperature=0.1` - AI temperature (0.1 for consistent analytical responses)

## Running Both Backends

To use both Ollama (local) and Gemini (online) backends simultaneously:

1. **Terminal 1 - Ollama Backend (port 8080):**
```bash
cd backend
mvn spring-boot:run
```

2. **Terminal 2 - Gemini Backend (port 9090):**
```bash
cd gemini-service
$env:GEMINI_API_KEY="your-api-key"  # Set key first
mvn spring-boot:run
```

3. **Terminal 3 - Frontend (port 5173):**
```bash
npm run dev
```

Then in the React UI, use the radio button to switch between "Local" (Ollama) and "Online" (Gemini) modes.

## Dependencies

- **Spring Boot 3.2.1** - web framework
- **Langchain4j 0.33.0** - AI model integration library
- **langchain4j-google-ai-gemini** - Gemini provider for Langchain4j
- **Jackson** - JSON processing
- **JUnit 5** - Testing

## Troubleshooting

### "API key not found" error
- Ensure `GEMINI_API_KEY` environment variable is set before starting the service
- Restart the terminal/IDE after setting the environment variable

### "DEADLINE_EXCEEDED" error
- Gemini API timeout occurred. Increase `gemini.timeout` value in `application.properties`

### CORS errors
- Ensure the frontend is running on `http://localhost:5173`
- Check that both backends have CORS enabled for that origin

### Gemini API errors
- Check your API key validity at [Google AI Studio](https://ai.google.dev/)
- Verify you haven't exceeded free tier usage limits

## Cost Considerations

The Gemini 1.5 Flash model is specifically chosen for:
- **Lower cost** - Significantly cheaper than other Gemini models
- **Faster responses** - Optimized for quick analysis tasks
- **Sufficient capability** - More than adequate for SQL analysis

Free tier includes monthly limits; check [Google's pricing page](https://ai.google.dev/pricing) for current quotas.

## License

Same as the main AISQLAnalyser project
