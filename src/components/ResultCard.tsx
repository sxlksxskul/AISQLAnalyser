import React from 'react';
import '../styles/ResultCard.css';

export type Rating = 'green' | 'amber' | 'red';

export interface AnalysisResult {
  category: string;
  rating: Rating;
  text: string;
}

interface ResultCardProps {
  result: AnalysisResult;
  index: number;
}

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

const getRatingSymbol = (rating: Rating): string => {
  switch (rating) {
    case 'green':
      return '✓';
    case 'amber':
      return '⚠';
    case 'red':
      return '⚠';
  }
};

const ResultCard: React.FC<ResultCardProps> = ({ result, index }) => {
  return (
    <div className={`result-card ${result.rating}`}>
      {/* Background Pattern */}
      <div className="result-card-bg" />

      {/* Category Badge */}
      <div className="result-card-category">
        {result.category}
      </div>
      
      {/* Icon */}
      <div className="result-card-icon">
        <span className="result-card-symbol">
          {getRatingSymbol(result.rating)}
        </span>
      </div>

      {/* Status Badge */}
      <div className="result-card-status">
        <div className="result-card-status-dot" />
        <span className="result-card-status-text">
          {getRatingLabel(result.rating)}
        </span>
      </div>

      {/* Description */}
      <div className="result-card-description">
        <p>{result.text}</p>
      </div>
    </div>
  );
};

export default ResultCard;