import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import { type DrugLabelResult, type FdaApiResponse } from './types';
import { Navbar } from './components/Navbar';
import { SearchBar } from './components/SearchBar';
import { DrugCard } from './components/DrugCard';
import { DrugDetail } from './DrugDetail';

const SearchHome: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<DrugLabelResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = query.trim();

    if (!trimmedQuery) return;

    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const endpoint = `https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${encodeURIComponent(
        trimmedQuery
      )}"&limit=20`;

      const response = await fetch(endpoint);

      if (response.status === 404) {
        setResults([]);
        return;
      }

      if (!response.ok) {
        throw new Error(`Server returned status: ${response.status}`);
      }

      const data: FdaApiResponse = await response.json();
      setResults(data.results ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pixabay-layout">
      <Navbar />

      <section className="hero-banner">
        <div className="hero-content">
          <span className="hero-tag">FDA Clinical Drug Label Database</span>
          <h1 className="hero-title">Know the medicine you take</h1>
          <p className="hero-subtitle">
            Search brand names, find generic compositions, and verify approved clinical usages.
          </p>

          <SearchBar
            query={query}
            isLoading={isLoading}
            onQueryChange={setQuery}
            onSubmit={handleSearch}
          />
        </div>
      </section>

      <main className="results-container">
        {isLoading && (
          <div className="state-notice">
            <div className="gentle-spinner"></div>
            <p>Scanning FDA pharmaceutical database...</p>
          </div>
        )}

        {error && !isLoading && (
          <div className="state-notice error-notice">
            <p>{error}. Please verify the query and try again.</p>
          </div>
        )}

        {hasSearched && !isLoading && !error && results.length === 0 && (
          <div className="state-notice">
            <p>No matching brand names registered under &ldquo;{query}&rdquo;.</p>
          </div>
        )}

        {!hasSearched && !isLoading && (
          <div className="empty-prompt">
            <p>Type a commercial drug name above to explore label monographs and active ingredients.</p>
          </div>
        )}

        {!isLoading && results.length > 0 && (
          <div className="results-wrapper">
            <div className="results-meta">
              <span>Showing {results.length} FDA registered entries</span>
            </div>
            <ul className="results-list">
              {results.map((item, index) => (
                <DrugCard key={item.id || index} item={item} index={index} />
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<SearchHome />} />
      <Route path="/drug/:id" element={<DrugDetail />} />
    </Routes>
  );
};

export default App;