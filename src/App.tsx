import React, { useState } from 'react';

type Rating = 'green' | 'amber' | 'red';

interface AnalysisResult {
  category: string;
  rating: Rating;
  text: string;
}

const App: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [showResults, setShowResults] = useState<boolean>(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleAnalyse = async () => {
    if (!query.trim()) {
      setError('Please enter a SQL query to analyze');
      return;
    }

    setIsLoading(true);
    setError('');
    setShowResults(false);

    try {
      const response = await fetch('http://localhost:8080/api/sql/analyse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: query.trim() }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success && data.results) {
        setAnalysisResults(data.results);
        setShowResults(true);
      } else {
        throw new Error(data.message || 'Analysis failed');
      }
    } catch (err) {
      console.error('Error analyzing query:', err);
      if (err instanceof Error) {
        setError(`Analysis failed: ${err.message}`);
      } else {
        setError('An unexpected error occurred. Please check if the backend server is running on port 8080.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getRatingColor = (rating: Rating): string => {
    switch (rating) {
      case 'green':
        return '#4caf50';
      case 'amber':
        return '#ff9800';
      case 'red':
        return '#f44336';
    }
  };

  const getRatingLabel = (rating: Rating): string => {
    switch (rating) {
      case 'green':
        return 'Good';
      case 'amber':
        return 'Could be Improved';
      case 'red':
        return 'Poor';
    }
  };

  return (
    <div style={{
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 25%, #7e22ce 50%, #3b82f6 75%, #06b6d4 100%)',
        padding: '40px 20px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 50%, rgba(14, 165, 233, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.4) 0%, transparent 50%)',
          filter: 'blur(60px)'
        }} />
        <h1 style={{
          textAlign: 'center',
          color: 'white',
          margin: '0',
          fontSize: '42px',
          fontWeight: '700',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          position: 'relative',
          zIndex: 1,
          fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        }}>
          AI SQL Query Analyser
        </h1>
      </header>

      {/* Main Content */}
      <main style={{
        flex: '1',
        maxWidth: '900px',
        width: '100%',
        margin: '0 auto',
        padding: '40px 20px'
      }}>
        <div style={{
          marginBottom: '30px'
        }}>
          <label style={{
            display: 'block',
            marginBottom: '10px',
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#555'
          }}>
            Enter SQL Query:
          </label>
          <div style={{
            display: 'flex',
            gap: '15px',
            alignItems: 'center'
          }}>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="SELECT * FROM users WHERE created_at > '2024-01-01'..."
              style={{
                flex: '1',
                minHeight: '150px',
                padding: '12px',
                fontSize: '14px',
                fontFamily: 'Consolas, Monaco, monospace',
                border: '1px solid #ddd',
                borderRadius: '4px',
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
            />
            <button
              onClick={handleAnalyse}
              disabled={isLoading}
              style={{
                padding: '12px 32px',
                fontSize: '16px',
                fontWeight: 'bold',
                color: 'white',
                backgroundColor: isLoading ? '#cccccc' : '#2196f3',
                border: 'none',
                borderRadius: '4px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s',
                position: 'relative',
                minWidth: '140px'
              }}
              onMouseOver={(e) => {
                if (!isLoading) e.currentTarget.style.backgroundColor = '#1976d2'
              }}
              onMouseOut={(e) => {
                if (!isLoading) e.currentTarget.style.backgroundColor = '#2196f3'
              }}
            >
              {isLoading ? (
                <>
                  <span style={{
                    display: 'inline-block',
                    width: '16px',
                    height: '16px',
                    border: '2px solid #ffffff',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    marginRight: '8px'
                  }}></span>
                  Analyzing...
                </>
              ) : (
                'Analyse Query'
              )}
            </button>
          </div>
        </div>

        {/* Categories Info Box */}
        <div style={{
          backgroundColor: '#f9f9f9',
          border: '1px solid #e0e0e0',
          borderRadius: '6px',
          padding: '15px',
          marginBottom: '30px'
        }}>
          <h3 style={{
            margin: '0 0 10px 0',
            fontSize: '16px',
            color: '#333'
          }}>
            Analysis Categories:
          </h3>
          <div style={{
            display: 'flex',
            gap: '20px',
            flexWrap: 'wrap'
          }}>
            <div style={{ flex: '1', minWidth: '150px' }}>
              <strong style={{ color: '#555' }}>Efficiency</strong>
              <p style={{ margin: '5px 0 0 0', fontSize: '13px', color: '#666' }}>
                Query performance and optimization
              </p>
            </div>
            <div style={{ flex: '1', minWidth: '150px' }}>
              <strong style={{ color: '#555' }}>Best Practices</strong>
              <p style={{ margin: '5px 0 0 0', fontSize: '13px', color: '#666' }}>
                Code quality and standards
              </p>
            </div>
            <div style={{ flex: '1', minWidth: '150px' }}>
              <strong style={{ color: '#555' }}>Cost</strong>
              <p style={{ margin: '5px 0 0 0', fontSize: '13px', color: '#666' }}>
                Resource usage and expenses
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            backgroundColor: '#fee',
            border: '1px solid #f88',
            borderRadius: '6px',
            padding: '15px',
            marginBottom: '20px',
            color: '#c33'
          }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {showResults && (
          <div>
            <h2 style={{
              color: '#333',
              marginBottom: '20px',
              borderBottom: '2px solid #eee',
              paddingBottom: '10px'
            }}>
              Analysis Results
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '20px'
            }}>
              {analysisResults.map((result, index) => (
                <div
                  key={index}
                  style={{
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '20px',
                    backgroundColor: '#fafafa',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center'
                  }}
                >
                  <h3 style={{
                    margin: '0 0 15px 0',
                    color: '#333',
                    fontSize: '20px'
                  }}>
                    {result.category}
                  </h3>
                  
                  {/* Icon */}
                  <div style={{
                    width: '80px',
                    height: '80px',
                    marginBottom: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '50px',
                    fontWeight: 'bold'
                  }}>
                    {result.rating === 'green' && (
                      <span style={{ 
                        color: getRatingColor(result.rating),
                        fontSize: '60px',
                        fontWeight: '900',
                        transform: 'scale(1.1, 1.2)',
                        display: 'inline-block'
                      }}>✓</span>
                    )}
                    {result.rating === 'amber' && (
                      <span style={{ 
                        color: getRatingColor(result.rating), 
                        fontSize: '60px',
                        fontWeight: '900',
                        transform: 'scale(1.1, 1.2)',
                        display: 'inline-block'
                      }}>!</span>
                    )}
                    {result.rating === 'red' && (
                      <span style={{ 
                        color: getRatingColor(result.rating),
                        fontSize: '60px',
                        fontWeight: '900',
                        transform: 'scale(1.1, 1.2)',
                        display: 'inline-block'
                      }}>✗</span>
                    )}
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '15px'
                  }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: getRatingColor(result.rating)
                    }} />
                    <span style={{
                      fontWeight: 'bold',
                      color: getRatingColor(result.rating),
                      fontSize: '14px'
                    }}>
                      {getRatingLabel(result.rating)}
                    </span>
                  </div>

                  <p style={{
                    margin: '0',
                    color: '#666',
                    lineHeight: '1.6',
                    fontSize: '14px',
                    textAlign: 'left'
                  }}>
                    {result.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 25%, #7e22ce 50%, #3b82f6 75%, #06b6d4 100%)',
        padding: '30px 20px',
        textAlign: 'center',
        boxShadow: '0 -4px 6px rgba(0,0,0,0.1)',
        marginTop: 'auto',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 30% 50%, rgba(14, 165, 233, 0.3) 0%, transparent 50%), radial-gradient(circle at 70% 50%, rgba(168, 85, 247, 0.4) 0%, transparent 50%)',
          filter: 'blur(40px)'
        }} />
        <p style={{
          margin: '0',
          color: 'white',
          fontSize: '14px',
          letterSpacing: '1px',
          position: 'relative',
          zIndex: 1
        }}>
          © 2025 AI SQL Query Analyser | Proof of Concept
        </p>
      </footer>
    </div>
  );
};

export default App;
