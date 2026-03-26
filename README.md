# AI SQL Analyser

A full-stack application for analyzing SQL queries using AI models. Choose between a local Ollama model or Google's Gemini API through an intuitive React interface.

## Features

- **Dual AI Backend Support**
  - **Local Mode**: Uses Ollama for private, cost-free analysis (requires local setup)
  - **Online Mode**: Uses Google Gemini 1.5 Flash for faster, cloud-based analysis (requires API key)
  
- **Comprehensive SQL Analysis**
  - Efficiency evaluation
  - Best practices review
  - Cost analysis
  - Security assessment
  - Query optimization suggestions

- **Responsive UI**
  - Real-time mode switching between local and online
  - Clean, intuitive analysis results display
  - Improved query suggestions

## Architecture

```
AISQLAnalyser/
├── frontend/           # React + TypeScript + Vite
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── backend/            # Spring Boot - Ollama Backend (Port 8080)
│   ├── src/main/java/com/sqlanalyzer/
│   ├── pom.xml
│   └── README.md
├── gemini-service/     # Spring Boot - Gemini Backend (Port 9090)
│   ├── src/main/java/com/sqlanalyzer/
│   ├── pom.xml
│   └── README.md
└── .env.example        # Environment variable template
```

## Quick Start (Recommended: Both Backends)

### Prerequisites

1. **Java 17+** - For both Spring Boot backends
2. **Maven 3.8.0+** - For building Java services
3. **Node.js 16+** - For React frontend
4. **Ollama** - For local model backend (optional but recommended)
   - [Install Ollama](https://ollama.ai/)
   - Run: `ollama pull qwen2.5-coder:3b` (or any model you prefer)
   - Verify: `ollama serve` runs on `http://localhost:11434`

5. **Google Gemini API Key** (for online mode)
   - Get free API key from [Google AI Studio](https://ai.google.dev/)

### Setup & Run

**1. Terminal 1 - Start Ollama Backend (Local Mode)**

```bash
# Set Ollama model if not already done
ollama pull qwen2.5-coder:3b

# Start Ollama (keep running)
cd backend
mvn spring-boot:run
```

Expected output: `Started SqlQueryAnalyserApplication on http://localhost:8080`

**2. Terminal 2 - Start Gemini Backend (Online Mode)**

```bash
# Set your Gemini API key
$env:GEMINI_API_KEY="your-api-key-from-google-ai-studio"  # PowerShell
# OR
set GEMINI_API_KEY=your-api-key-from-google-ai-studio      # Command Prompt

# Run Gemini service
cd gemini-service
mvn spring-boot:run
```

Expected output: `Started GeminiAnalyserApplication on http://localhost:9090`

**3. Terminal 3 - Start React Frontend**

```bash
npm install  # First time only
npm run dev
```

Expected output: `VITE v#.#.# ready in ### ms` - Open `http://localhost:5173`

### Usage

1. Open `http://localhost:5173` in your browser
2. Enter a SQL query in the text area
3. Choose analysis mode:
   - **Local** - Uses Ollama (free, runs locally, slower)
   - **Online** - Uses Gemini API (requires API key, faster, costs money if over free tier)
4. Click "Analyse Query"
5. View comprehensive analysis results

## Project Structure Details

### Frontend (`src/`)

- `App.tsx` - Main application component with state management
- `components/` - React components for UI
  - `QueryInput.tsx` - SQL input with mode selector radio buttons
  - `ResultsSection.tsx` - Results display area
  - `ResultCard.tsx` - Individual analysis result card
- `hooks/useAnalysis.ts` - API communication hook with endpoint switching

### Backend (`backend/`)

**Local Ollama Backend running on port 8080**

- `SqlQueryAnalyzerApplication.java` - Spring Boot entry point
- `config/OllamaConfig.java` - Ollama model configuration
- `controller/SqlQueryAnalysisController.java` - REST API endpoints
- `service/SqlQueryAnalysisService.java` - Analysis logic with prompt building
- `model/` - Data classes (AnalysisResult, Rating, SqlQueryAnalysisResponse, etc.)

See [backend/README.md](backend/README.md) for detailed documentation.

### Gemini Service (`gemini-service/`)

**Google Gemini Backend running on port 9090**

- Same controller and service structure as backend (reusable via Langchain4j interface)
- `config/GeminiConfig.java` - Gemini model configuration with API key injection
- Uses `gemini-1.5-flash` model (cheaper and faster)

See [gemini-service/README.md](gemini-service/README.md) for detailed documentation.

## API Endpoints

Both backends expose identical REST APIs:

### Local Backend (Ollama)
- `POST http://localhost:8080/api/sql/analyse` - Analyze SQL query
- `GET http://localhost:8080/api/sql/health` - Health check
- `GET http://localhost:8080/api/sql/test-ai` - Test AI communication

### Online Backend (Gemini)
- `POST http://localhost:9090/api/sql/analyse` - Analyze SQL query
- `GET http://localhost:9090/api/sql/health` - Health check
- `GET http://localhost:9090/api/sql/test-ai` - Test AI communication

**Request Format:**
```json
{
  "query": "SELECT * FROM users WHERE id = 1"
}
```

**Response Format:**
```json
{
  "success": true,
  "message": "Analysis completed successfully",
  "results": [
    {
      "category": "Efficiency",
      "rating": "amber|green|red",
      "text": "Detailed feedback..."
    },
    ...
  ],
  "improvedQuery": "SELECT id, name FROM users WHERE id = 1"
}
```

## Mode Comparison

| Aspect | Local (Ollama) | Online (Gemini) |
|--------|---|---|
| **Cost** | Free | Free tier, then pay-per-use |
| **Speed** | Slower (~10-30s) | Faster (~2-5s) |
| **Privacy** | Fully private | Sent to Google servers |
| **Dependency** | Requires Ollama running | Requires internet + API key |
| **Model** | qwen2.5-coder:3b | gemini-1.5-flash |
| **Port** | 8080 | 9090 |

## Configuration

### Environment Variables

```bash
# Gemini API Key (Required for online mode)
GEMINI_API_KEY=your-api-key-here
```

### Backend Configuration Files

**`backend/src/main/resources/application.properties`** (Ollama)
```properties
server.port=8080
ollama.base-url=http://localhost:11434
ollama.model-name=qwen2.5-coder:3b
ollama.timeout=60
ollama.temperature=0.1
```

**`gemini-service/src/main/resources/application.properties`** (Gemini)
```properties
server.port=9090
gemini.api-key=${GEMINI_API_KEY:your-default-key}
gemini.model-name=gemini-1.5-flash
gemini.timeout=60
gemini.temperature=0.1
```

## Running Individual Backends

### Local Only (Ollama)

```bash
# Terminal 1
cd backend
mvn spring-boot:run

# Terminal 2
npm run dev
```

Then in UI, only "Local" mode is available. Note: Gemini API key is still needed in the backend to start, even if not used.

### Online Only (Gemini)

```bash
# Terminal 1
$env:GEMINI_API_KEY="your-key"
cd gemini-service
mvn spring-boot:run

# Terminal 2
npm run dev
```

Then in UI, only "Online" mode is available.

## Troubleshooting

### "Local mode not working"
- Ensure Ollama is running: `ollama serve`
- Check backend health: `curl http://localhost:8080/api/sql/health`
- Verify model exists: `ollama list`

### "Online mode gives API errors"
- Verify API key: `echo $env:GEMINI_API_KEY`
- Check key validity at [Google AI Studio](https://ai.google.dev/)
- Ensure you haven't exceeded free tier limits
- Check internet connectivity

### CORS errors in browser console
- Verify both backends are running
- Check that frontend is on `http://localhost:5173`
- Restart backends if frontend was started first

### "Cannot find jest" or npm errors
- Run `npm install` from project root
- Delete `node_modules` and `package-lock.json`, then reinstall

### Port already in use
- Ollama: `netstat -ano | findstr :11434` (Windows)
- Backend: `netstat -ano | findstr :8080` (Windows)
- Gemini: `netstat -ano | findstr :9090` (Windows)

## Development

### Building

```bash
# Frontend
npm run build

# Backend (both)
mvn clean install
```

### Running Tests

```bash
# Frontend
npm run test

# Backend
mvn test
```

### Linting

```bash
# Frontend
npm run lint
```

## Technologies Used

### Frontend
- React 18.2.0
- TypeScript 5.2.2
- Vite
- CSS3

### Backend (Shared)
- Spring Boot 3.2.1
- Java 17
- Maven 3.8.0+

### AI Integration
- Langchain4j 0.33.0 (abstraction layer)
- Langchain4j-Ollama (local model provider)
- Langchain4j-Google-AI-Gemini (Gemini provider)

### Other
- Jackson (JSON processing)
- SLF4J & Logback (logging)
- JUnit 5 (testing)

## Future Enhancements

- [ ] Side-by-side comparison of Ollama vs Gemini results
- [ ] Query history and saved queries
- [ ] Performance metrics dashboard
- [ ] User authentication and API rate limiting
- [ ] Support for other AI models (Claude, OpenAI, etc.)
- [ ] Docker Compose for easy local deployment
- [ ] Usage analytics and cost tracking

## Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

[Your chosen license - e.g., MIT, Apache 2.0]

## Support

For issues and questions:
- Check [Troubleshooting](#troubleshooting) section
- Review [backend/README.md](backend/README.md) and [gemini-service/README.md](gemini-service/README.md)
- Open an issue on GitHub
