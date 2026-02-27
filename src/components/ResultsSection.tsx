import React from 'react';
import ResultCard, { AnalysisResult } from './ResultCard';

interface ResultsSectionProps {
  results: AnalysisResult[];
}

const ResultsSection: React.FC<ResultsSectionProps> = ({ results }) => {
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
    </div>
  );
};

export default ResultsSection;