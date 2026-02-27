import React from 'react';

interface QueryInputProps {
  query: string;
  setQuery: (query: string) => void;
  onAnalyse: () => void;
  isLoading: boolean;
}

const QueryInput: React.FC<QueryInputProps> = ({ query, setQuery, onAnalyse, isLoading }) => {
  return (
    <div className="query-section">
      <label className="query-label">
        Enter SQL Query:
      </label>
      <div className="query-input-container">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="SELECT * FROM users WHERE created_at > '2024-01-01'..."
          className="query-textarea"
        />
        <button
          onClick={onAnalyse}
          disabled={isLoading}
          className="analyze-button"
        >
          {isLoading ? (
            <>
              <span className="loading-spinner"></span>
              Analysing...
            </>
          ) : (
            'Analyse Query'
          )}
        </button>
      </div>
    </div>
  );
};

export default QueryInput;