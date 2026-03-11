# AI SQL Query Analyser - Code Documentation

## 📋 Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
- [Backend Components](#backend-components)
- [Frontend Components](#frontend-components)
- [Data Flow](#data-flow)
- [Configuration](#configuration)
- [Dependencies](#dependencies)

---

## 🏗️ Overview

The AI SQL Query Analyser is a full-stack web application that provides intelligent analysis of SQL queries using AI. It consists of:

- **Backend**: Spring Boot REST API that processes SQL queries using Ollama AI
- **Frontend**: React TypeScript application with a clean, modern UI
- **AI Engine**: Ollama running locally with Qwen2.5-Coder model

---

## 🎯 Architecture

```
┌─────────────────┐    HTTP POST     ┌─────────────────┐    HTTP POST    ┌─────────────────┐
│   React App     │ ──────────────→  │  Spring Boot    │ ──────────────→ │   Ollama AI     │
│ (Frontend)      │                  │   (Backend)     │                 │   (AI Engine)   │
│ Port: 5173      │ ←───────────────  │  Port: 8080     │ ←──────────────  │  Port: 11434    │
└─────────────────┘    JSON Response └─────────────────┘   AI Response   └─────────────────┘
```

---

## 🔧 Backend Components

### 📂 Directory Structure
```
backend/
├── src/main/java/com/sqlanalyzer/
│   ├── SqlQueryAnalyserApplication.java    # Main Spring Boot application
│   ├── config/
│   │   └── OllamaConfig.java              # Ollama AI configuration
│   ├── controller/
│   │   └── SqlQueryAnalysisController.java # REST API endpoints
│   ├── model/
│   │   ├── AnalysisResult.java            # Individual analysis result
│   │   ├── Rating.java                    # Rating enum (GREEN, AMBER, RED)
│   │   ├── SqlQueryAnalysisResponse.java  # API response wrapper
│   │   └── SqlQueryRequest.java           # API request wrapper
│   └── service/
│       └── SqlQueryAnalysisService.java   # Business logic for SQL analysis
└── src/main/resources/
    └── application.properties             # Application configuration
```

### 🎯 Component Details

#### **SqlQueryAnalyserApplication.java**
- **Purpose**: Main entry point for the Spring Boot application
- **Responsibilities**: 
  - Starts the embedded Tomcat server
  - Initializes Spring context and all beans
  - Enables auto-configuration

#### **OllamaConfig.java** 
- **Purpose**: Configuration for Ollama AI integration
- **Responsibilities**:
  - Creates and configures Ollama ChatLanguageModel bean
  - Sets up connection to local Ollama instance (localhost:11434)
  - Configures the AI model (qwen2.5-coder:3b)

#### **SqlQueryAnalysisController.java**
- **Purpose**: REST API controller handling HTTP requests
- **Endpoints**:
  - `POST /api/sql/analyse` - Analyzes SQL queries
- **Responsibilities**:
  - Validates incoming requests
  - Delegates to service layer
  - Returns JSON responses
  - Handles errors and exceptions

#### **SqlQueryAnalysisService.java**
- **Purpose**: Core business logic for SQL analysis
- **Responsibilities**:
  - Constructs prompts for AI analysis
  - Communicates with Ollama AI
  - Parses AI responses into structured data
  - Categorizes analysis into: Efficiency, Best Practices, Cost, Security

#### **Model Classes**
- **SqlQueryRequest.java**: Wraps incoming SQL query from frontend
- **SqlQueryAnalysisResponse.java**: Wraps response with success flag and results
- **AnalysisResult.java**: Individual analysis result with category, rating, and text
- **Rating.java**: Enum for result ratings (GREEN/AMBER/RED)

---

## ⚛️ Frontend Components

### 📂 Directory Structure
```
src/
├── components/
│   ├── index.ts                    # Barrel exports for clean imports
│   ├── Header.tsx                  # Application header with title
│   ├── Footer.tsx                  # Application footer with copyright
│   ├── QueryInput.tsx              # SQL input form with textarea and button
│   ├── CategoriesInfo.tsx          # Information about analysis categories
│   ├── ResultCard.tsx              # Individual result display card
│   ├── ResultsSection.tsx          # Container for all results
│   └── ErrorMessage.tsx            # Error display component
├── hooks/
│   └── useAnalysis.ts              # Custom hook for API calls and state
├── styles/
│   ├── App.css                     # Main layout and animations
│   ├── CategoriesInfo.css          # Styles for categories section
│   └── ResultCard.css              # Styles for result cards
└── App.tsx                         # Main application component
```

### 🎯 Component Details

#### **App.tsx**
- **Purpose**: Root component that orchestrates the entire application
- **Responsibilities**:
  - Manages query state
  - Uses useAnalysis hook for API interactions
  - Renders all child components in proper layout
  - Handles component composition

#### **Header.tsx**
- **Purpose**: Application header with branding
- **Features**:
  - Gradient background
  - Responsive design
  - Professional typography

#### **QueryInput.tsx**
- **Purpose**: User input interface for SQL queries
- **Features**:
  - Large textarea for SQL input
  - Analyze button with loading state
  - Loading spinner during API calls
  - Form validation

#### **CategoriesInfo.tsx**
- **Purpose**: Educational component explaining analysis categories
- **Categories Explained**:
  - **Efficiency**: Query performance and optimization
  - **Best Practices**: Code quality and standards
  - **Cost Analysis**: Resource usage and expenses
  - **Security**: SQL injection risks and secure practices

#### **ResultCard.tsx**
- **Purpose**: Displays individual analysis results
- **Features**:
  - Color-coded by rating (Green/Amber/Red)
  - Animated icons and status indicators
  - Hover effects and animations
  - Structured layout with category, rating, and description

#### **ResultsSection.tsx**
- **Purpose**: Container for displaying all analysis results
- **Features**:
  - Grid layout for responsive design
  - Results header with title and subtitle
  - Maps through results array

#### **ErrorMessage.tsx**
- **Purpose**: User-friendly error display
- **Features**:
  - Clear error messaging
  - Styled error container
  - Consistent with app design

#### **useAnalysis.ts**
- **Purpose**: Custom hook managing API calls and analysis state
- **State Management**:
  - `analysisResults`: Array of analysis results
  - `isLoading`: Loading state for UI feedback
  - `error`: Error messages for user feedback
  - `showResults`: Controls results visibility
- **Functions**:
  - `analyseQuery()`: Sends POST request to backend API

---

## 🔄 Data Flow

### 1. **User Input**
```
User types SQL → QueryInput component → App.tsx state
```

### 2. **API Request**
```
User clicks "Analyse" → useAnalysis hook → POST /api/sql/analyse
```

### 3. **Backend Processing**
```
Controller receives request → Service calls Ollama AI → AI processes query → Response returned
```

### 4. **Frontend Display**
```
Response received → State updated → ResultsSection renders → ResultCards display results
```

### 5. **Result Categories**
Each query is analyzed across four dimensions:
- **Efficiency** (Performance optimization suggestions)
- **Best Practices** (Code quality improvements)  
- **Cost Analysis** (Resource usage insights)
- **Security** (Injection risks and security recommendations)

---

## ⚙️ Configuration

### **Backend Configuration** (`application.properties`)
```properties
# Server Configuration
server.port=8080                                    # Backend server port

# Ollama AI Configuration  
ollama.base-url=http://localhost:11434             # Ollama service URL
ollama.model-name=qwen2.5-coder:3b                 # AI model name
ollama.timeout=60                                  # Request timeout (seconds)

# CORS Configuration
management.endpoints.web.cors.allowed-origins=http://localhost:5173  # Frontend URL
```

### **Frontend Configuration**
- **Development Server**: Vite serves on `http://localhost:5173`
- **API Base URL**: Hardcoded to `http://localhost:8080/api/sql/analyse`
- **Build Tool**: Vite with React and TypeScript

---

## 📦 Dependencies

### **Backend Dependencies**
- **Spring Boot Starter Web**: REST API framework
- **Spring Boot DevTools**: Development hot-reload
- **LangChain4j Ollama**: AI integration library
- **Jackson**: JSON serialization/deserialization

### **Frontend Dependencies**
- **React**: UI library for component-based architecture
- **TypeScript**: Type-safe JavaScript superset
- **Vite**: Fast build tool and development server

### **AI Dependencies**
- **Ollama**: Local AI inference engine
- **Qwen2.5-Coder:3b**: Specialized coding AI model (1.9GB)

---

## 🚀 How It All Works Together

1. **Startup Sequence**:
   - Ollama service starts and loads the AI model
   - Spring Boot backend starts and connects to Ollama
   - React frontend starts and serves the UI

2. **User Interaction**:
   - User enters SQL query in the frontend
   - Frontend sends HTTP POST to backend
   - Backend forwards query to Ollama AI
   - AI analyzes query and returns insights
   - Backend structures response and returns to frontend
   - Frontend displays results in categorized cards

3. **Result Processing**:
   - Each query gets analyzed across 4 categories
   - Results are rated as GREEN (good), AMBER (could improve), or RED (poor)
   - Each result includes detailed explanations and recommendations

This architecture provides a clean separation of concerns, making the code maintainable, testable, and scalable. The modular frontend components make it easy to modify the UI, while the service-based backend architecture allows for easy extension and modification of business logic.