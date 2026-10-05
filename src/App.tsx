import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BrowserRouter, Routes, Route, useSearchParams } from 'react-router-dom';
import './App.css';
import { type DrugLabelResult, type FdaApiResponse } from './types';
import { Navbar } from './components/Navbar';
import { SearchBar } from './components/SearchBar';
import { DrugCard } from './components/DrugCard';
// Change to './pages/DrugDetail' if DrugDetail is located inside src/pages/
import { DrugDetail } from './DrugDetail';

const SearchHome: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState<string>(urlQuery);
  const [results, setResults] = useState<DrugLabelResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(Boolean(urlQuery));

  const abortControllerRef = useRef<AbortController | null>(null);

  const executeSearch = useCallback(async (searchTerm: string) => {
    const trimmed = searchTerm.trim();
    if (!trimmed) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const endpoint = `https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${encodeURIComponent(
        trimmed
      )}"&limit=20`;

      const response = await fetch(endpoint, {
        signal: abortControllerRef.current.signal,
      });

      // FDA API returns 404 when no items match
      if (response.status === 404) {
        setResults([]);
        return;
      }

      if (!response.ok) {
        throw new Error(`FDA service responded with status: ${response.status}`);
      }

      const data: FdaApiResponse = await response.json();
      setResults(data.results ?? []);
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        return; // Ignore intentional fetch cancel
      }
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Synchronize on initial mount or when returning back via browser history
  useEffect(() => {
    if (urlQuery) {
      setQuery(urlQuery);
      executeSearch(urlQuery);
    }
  }, [urlQuery, executeSearch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();

    if (!trimmed) return;

    // Update query params in the URL (enables sharing & preserves state on navigation)
    setSearchParams({ q: trimmed });
    executeSearch(trimmed);
  };

  return (
    <div className="pixabay-layout">
      <Navbar />

      {/* Hero Section */}
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
            onSubmit={handleSearchSubmit}
          />
        </div>
      </section>

      {/* Results Section */}
      <main className="results-container">
        {isLoading && (
          <div className="state-notice">
            <div className="gentle-spinner"></div>
            <p>Scanning FDA pharmaceutical database...</p>
          </div>
        )}

        {error && !isLoading && (
          <div className="state-notice error-notice">
            <p>{error}. Please verify the drug name and try again.</p>
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
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SearchHome />} />
        <Route path="/drug/:id" element={<DrugDetail />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;