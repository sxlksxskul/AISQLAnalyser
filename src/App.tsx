import React, { useState } from 'react';
import './styles/App.css';
import {
  Header,
  Footer,
  QueryInput,
  CategoriesInfo,
  ResultsSection,
  ErrorMessage
} from './components';
import { useAnalysis } from './hooks/useAnalysis';

const App: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const { analysisResults, improvedQuery, isLoading, error, showResults, analyseQuery } = useAnalysis();

  const handleAnalyse = () => {
    analyseQuery(query);
  };

  return (
    <div className="app">
      <Header />
      
      <main className="main-content">
        <QueryInput 
          query={query}
          setQuery={setQuery}
          onAnalyse={handleAnalyse}
          isLoading={isLoading}
        />
        
        <CategoriesInfo />
        
        {error && <ErrorMessage message={error} />}
        
        {showResults && <ResultsSection results={analysisResults} improvedQuery={improvedQuery} />}
      </main>
      
      <Footer />
    </div>
  );
};

export default App;
