import React, { useState, useEffect } from 'react';

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

  // Add CSS animations
  const cssAnimations = `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(50px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.1);
      }
    }

    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% {
        transform: translateY(0);
      }
      40% {
        transform: translateY(-10px);
      }
      60% {
        transform: translateY(-5px);
      }
    }

    @keyframes shake {
      0%, 100% {
        transform: translateX(0);
      }
      25% {
        transform: translateX(-5px);
      }
      75% {
        transform: translateX(5px);
      }
    }

    @keyframes glow {
      from {
        box-shadow: 0 0 5px currentColor;
      }
      to {
        box-shadow: 0 0 20px currentColor, 0 0 30px currentColor;
      }
    }

    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  `;

  // Inject styles into document head
  React.useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = cssAnimations;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const handleAnalyse = async () => {
    if (!query.trim()) {
      setError('Please enter a SQL query to analyse');
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
      console.error('Error analysing query:', err);
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
                  Analysing...
                </>
              ) : (
                'Analyse Query'
              )}
            </button>
          </div>
        </div>

        {/* Enhanced Categories Info Box */}
        <div style={{
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '32px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.04), 0 2px 4px rgba(0,0,0,0.02)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Background decoration */}
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.05) 0%, transparent 70%)',
            borderRadius: '50%',
            transform: 'translate(50px, -50px)'
          }} />
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '20px',
            position: 'relative',
            zIndex: 1
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '12px',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
            }}>
              <span style={{ fontSize: '20px' }}>📊</span>
            </div>
            <h3 style={{
              margin: '0',
              fontSize: '20px',
              fontWeight: '700',
              color: '#1e293b',
              letterSpacing: '0.3px'
            }}>
              Analysis Categories
            </h3>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            position: 'relative',
            zIndex: 1
          }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.08) 0%, rgba(34, 197, 94, 0.04) 100%)',
              border: '1px solid rgba(34, 197, 94, 0.2)',
              borderRadius: '12px',
              padding: '16px',
              transition: 'all 0.2s ease'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '8px'
              }}>
                <span style={{ fontSize: '16px', marginRight: '8px' }}>⚡</span>
                <strong style={{ 
                  color: '#059669',
                  fontSize: '16px',
                  fontWeight: '600'
                }}>
                  Efficiency
                </strong>
              </div>
              <p style={{ 
                margin: '0', 
                fontSize: '14px', 
                color: '#64748b',
                lineHeight: '1.5'
              }}>
                Query performance and optimisation strategies
              </p>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(59, 130, 246, 0.04) 100%)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              borderRadius: '12px',
              padding: '16px',
              transition: 'all 0.2s ease'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '8px'
              }}>
                <span style={{ fontSize: '16px', marginRight: '8px' }}>✨</span>
                <strong style={{ 
                  color: '#2563eb',
                  fontSize: '16px',
                  fontWeight: '600'
                }}>
                  Best Practices
                </strong>
              </div>
              <p style={{ 
                margin: '0', 
                fontSize: '14px', 
                color: '#64748b',
                lineHeight: '1.5'
              }}>
                Code quality, standards and maintainability
              </p>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.08) 0%, rgba(168, 85, 247, 0.04) 100%)',
              border: '1px solid rgba(168, 85, 247, 0.2)',
              borderRadius: '12px',
              padding: '16px',
              transition: 'all 0.2s ease'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '8px'
              }}>
                <span style={{ fontSize: '16px', marginRight: '8px' }}>💰</span>
                <strong style={{ 
                  color: '#7c3aed',
                  fontSize: '16px',
                  fontWeight: '600'
                }}>
                  Cost Analysis
                </strong>
              </div>
              <p style={{ 
                margin: '0', 
                fontSize: '14px', 
                color: '#64748b',
                lineHeight: '1.5'
              }}>
                Resource usage and computational expenses
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
          <div style={{ animation: 'fadeInUp 0.6s ease-out' }}>
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '32px',
              boxShadow: '0 8px 32px rgba(102, 126, 234, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <h2 style={{
                color: 'white',
                marginBottom: '8px',
                fontSize: '28px',
                fontWeight: '700',
                textAlign: 'center',
                textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                letterSpacing: '0.5px'
              }}>
                🎯 Analysis Results
              </h2>
              <p style={{
                color: 'rgba(255, 255, 255, 0.85)',
                textAlign: 'center',
                margin: '0',
                fontSize: '16px',
                fontWeight: '400'
              }}>
                AI-powered insights for your SQL query optimisation
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '24px',
              marginBottom: '20px'
            }}>
              {analysisResults.map((result, index) => (
                <div
                  key={index}
                  style={{
                    position: 'relative',
                    background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                    border: `2px solid ${getRatingColor(result.rating)}20`,
                    borderRadius: '20px',
                    padding: '28px',
                    boxShadow: `0 8px 32px ${getRatingColor(result.rating)}15, 0 2px 8px rgba(0,0,0,0.08)`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    animation: `slideInUp 0.6s ease-out ${index * 0.1}s both`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                    e.currentTarget.style.boxShadow = `0 16px 48px ${getRatingColor(result.rating)}25, 0 8px 16px rgba(0,0,0,0.12)`;
                    e.currentTarget.style.borderColor = `${getRatingColor(result.rating)}40`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = `0 8px 32px ${getRatingColor(result.rating)}15, 0 2px 8px rgba(0,0,0,0.08)`;
                    e.currentTarget.style.borderColor = `${getRatingColor(result.rating)}20`;
                  }}
                >
                  {/* Background Pattern */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '100px',
                    height: '100px',
                    background: `radial-gradient(circle, ${getRatingColor(result.rating)}08 0%, transparent 70%)`,
                    borderRadius: '50%',
                    transform: 'translate(30px, -30px)'
                  }} />

                  {/* Category Badge */}
                  <div style={{
                    background: `linear-gradient(135deg, ${getRatingColor(result.rating)} 0%, ${getRatingColor(result.rating)}dd 100%)`,
                    color: 'white',
                    padding: '8px 20px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: '600',
                    marginBottom: '20px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    boxShadow: `0 4px 12px ${getRatingColor(result.rating)}30`,
                    position: 'relative',
                    zIndex: 1
                  }}>
                    {result.category}
                  </div>
                  
                  {/* Enhanced Icon with Animation */}
                  <div style={{
                    width: '100px',
                    height: '100px',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${getRatingColor(result.rating)}15 0%, ${getRatingColor(result.rating)}08 100%)`,
                    border: `3px solid ${getRatingColor(result.rating)}30`,
                    position: 'relative',
                    zIndex: 1,
                    transition: 'all 0.3s ease'
                  }}>
                    {result.rating === 'green' && (
                      <span style={{ 
                        color: getRatingColor(result.rating),
                        fontSize: '48px',
                        fontWeight: '900',
                        display: 'inline-block',
                        animation: 'pulse 2s infinite'
                      }}>✓</span>
                    )}
                    {result.rating === 'amber' && (
                      <span style={{ 
                        color: getRatingColor(result.rating), 
                        fontSize: '48px',
                        fontWeight: '900',
                        display: 'inline-block',
                        animation: 'bounce 2s infinite'
                      }}>⚠</span>
                    )}
                    {result.rating === 'red' && (
                      <span style={{ 
                        color: getRatingColor(result.rating),
                        fontSize: '48px',
                        fontWeight: '900',
                        display: 'inline-block',
                        animation: 'shake 2s infinite'
                      }}>⚠</span>
                    )}
                  </div>

                  {/* Status Badge */}
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 16px',
                    backgroundColor: `${getRatingColor(result.rating)}10`,
                    border: `1px solid ${getRatingColor(result.rating)}30`,
                    borderRadius: '25px',
                    marginBottom: '20px'
                  }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: getRatingColor(result.rating),
                      animation: 'glow 2s infinite alternate'
                    }} />
                    <span style={{
                      fontWeight: '600',
                      color: getRatingColor(result.rating),
                      fontSize: '13px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      {getRatingLabel(result.rating)}
                    </span>
                  </div>

                  {/* Enhanced Description */}
                  <div style={{
                    background: 'linear-gradient(145deg, #f8fafc 0%, #e2e8f0 100%)',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid rgba(226, 232, 240, 0.8)',
                    position: 'relative',
                    zIndex: 1
                  }}>
                    <p style={{
                      margin: '0',
                      color: '#475569',
                      lineHeight: '1.7',
                      fontSize: '14px',
                      fontWeight: '400',
                      textAlign: 'left'
                    }}>
                      {result.text}
                    </p>
                  </div>
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
