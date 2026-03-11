import { useState } from 'react';
import { AnalysisResult } from '../components/ResultCard';

export const useAnalysis = () => {
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [improvedQuery, setImprovedQuery] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [showResults, setShowResults] = useState<boolean>(false);

  const analyseQuery = async (query: string) => {
    if (!query.trim()) {
      setError('Please enter a SQL query to analyse');
      return;
    }

    setIsLoading(true);
    setError('');
    setShowResults(false);
    setImprovedQuery(null);

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
        setImprovedQuery(data.improvedQuery ?? null);
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

  return {
    analysisResults,
    improvedQuery,
    isLoading,
    error,
    showResults,
    analyseQuery
  };
};