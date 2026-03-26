import React from 'react';
import { AnalysisMode } from '../hooks/useAnalysis';

interface QueryInputProps {
  query: string;
  setQuery: (query: string) => void;
  onAnalyse: () => void;
  isLoading: boolean;
  mode: AnalysisMode;
  setMode: (mode: AnalysisMode) => void;
}

const QueryInput: React.FC<QueryInputProps> = ({ query, setQuery, onAnalyse, isLoading, mode, setMode }) => {
  return (
    <div className="query-section">
      <div className="mode-selector">
        <span className="mode-label">Analysis Mode:</span>
        <label className={`mode-option ${mode === 'local' ? 'mode-option--active' : ''}`}>
          <input
            type="radio"
            name="mode"
            value="local"
            checked={mode === 'local'}
            onChange={() => setMode('local')}
          />
          <span className="mode-option-icon">&#x1F4BB;</span>
          Local
        </label>
        <label className={`mode-option ${mode === 'online' ? 'mode-option--active' : ''}`}>
          <input
            type="radio"
            name="mode"
            value="online"
            checked={mode === 'online'}
            onChange={() => setMode('online')}
          />
          <span className="mode-option-icon">&#x1F310;</span>
          Online
        </label>
      </div>

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