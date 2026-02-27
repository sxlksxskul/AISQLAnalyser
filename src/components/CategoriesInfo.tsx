import React from 'react';
import '../styles/CategoriesInfo.css';

const CategoriesInfo: React.FC = () => {
  const categories = [
    {
      key: 'efficiency',
      emoji: '⚡',
      name: 'Efficiency',
      description: 'Query performance and optimisation strategies'
    },
    {
      key: 'best-practices',
      emoji: '✨',
      name: 'Best Practices',
      description: 'Code quality, standards and maintainability'
    },
    {
      key: 'cost',
      emoji: '💰',
      name: 'Cost Analysis',
      description: 'Resource usage and computational expenses'
    },
    {
      key: 'security',
      emoji: '🔒',
      name: 'Security',
      description: 'SQL injection risks and secure coding practices'
    }
  ];

  return (
    <div className="categories-info">
      <div className="categories-bg-decoration" />
      
      <div className="categories-header">
        <div className="categories-icon">
          <span>📊</span>
        </div>
        <h3 className="categories-title">
          Analysis Categories
        </h3>
      </div>

      <div className="categories-grid">
        {categories.map((category) => (
          <div key={category.key} className={`category-card ${category.key}`}>
            <div className="category-header">
              <span className="category-emoji">{category.emoji}</span>
              <strong className="category-name">
                {category.name}
              </strong>
            </div>
            <p className="category-description">
              {category.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesInfo;