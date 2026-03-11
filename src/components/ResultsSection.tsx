import React from 'react';
import ResultCard, { AnalysisResult } from './ResultCard';

interface ResultsSectionProps {
  results: AnalysisResult[];
  improvedQuery?: string | null;
}

const ResultsSection: React.FC<ResultsSectionProps> = ({ results, improvedQuery }) => {
  return (
    <div className="results-container">
      <div className="results-header">
        <h2 className="results-title">
          🎯 Analysis Results
        </h2>
        <p className="results-subtitle">
          AI-powered insights for your SQL query optimisation
        </p>
      </div>

      <div className="results-grid">
        {results.map((result, index) => (
          <ResultCard key={index} result={result} index={index} />
        ))}
      </div>

      {improvedQuery && (
        <div className="improved-query-container">
          <h3 className="improved-query-title">⚡ Optimised Query</h3>
          <pre className="improved-query-code">
            <code>{improvedQuery}</code>
          </pre>
        </div>
      )}
    </div>
  );
};

export default ResultsSection;