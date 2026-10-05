import React, { useState } from 'react';
import './App.css';
import { type DrugLabelResult, type FdaApiResponse } from './types';


export const App: React.FC = () => {
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
      setError(
        err instanceof Error ? err.message : 'An unexpected error occurred.'
      );
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pixabay-layout">
      {/* Hero Section (Quarter Screen Height) */}
      <section className="hero-banner">
        <div className="hero-content">
          <span className="hero-tag">FDA Clinical Drug Label Database</span>
          <h1 className="hero-title">Know the medicine you take</h1>
          <p className="hero-subtitle">
            Search brand names, find generic compositions, and verify approved clinical usages.
          </p>

          <form onSubmit={handleSearch} className="search-bar">
            <svg
              className="search-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
              />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by brand name (e.g. Advil, Tylenol, Lipitor)..."
              className="search-input"
            />
            <button type="submit" disabled={isLoading} className="search-btn">
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>
      </section>

      {/* Main Results Container */}
      <main className="results-container">
        {/* Loading Spinner */}
        {isLoading && (
          <div className="state-notice">
            <div className="gentle-spinner"></div>
            <p>Scanning FDA pharmaceutical database...</p>
          </div>
        )}

        {/* Error Notification */}
        {error && !isLoading && (
          <div className="state-notice error-notice">
            <p>{error}. Please verify the query and try again.</p>
          </div>
        )}

        {/* Empty Result */}
        {hasSearched && !isLoading && !error && results.length === 0 && (
          <div className="state-notice">
            <p>No matching brand names registered under &ldquo;{query}&rdquo;.</p>
          </div>
        )}

        {/* Initial Empty State before Searching */}
        {!hasSearched && !isLoading && (
          <div className="empty-prompt">
            <p>Type a commercial drug name above to explore label monographs and active ingredients.</p>
          </div>
        )}

        {/* Results Grid */}
        {!isLoading && results.length > 0 && (
          <div className="results-wrapper">
            <div className="results-meta">
              <span>Showing {results.length} FDA registered entries</span>
            </div>
            <ul className="results-list">
              {results.map((item, index) => {
                const brand = item.openfda?.brand_name?.join(', ') || 'Unspecified Brand';
                const generic = item.openfda?.generic_name?.join(', ') || 'N/A';
                const manufacturer = item.openfda?.manufacturer_name?.join(', ') || 'N/A';
                const purpose =
                  item.purpose?.[0] ||
                  item.indications_and_usage?.[0] ||
                  'No clinical monograph summary available.';

                return (
                  <li key={item.id || index} className="drug-card">
                    <div className="card-top">
                      <h2 className="drug-title">{brand}</h2>
                      <span className="route-tag">
                        {item.openfda?.route?.[0] || 'Standard'}
                      </span>
                    </div>

                    <div className="drug-details">
                      <div className="detail-item">
                        <span className="label">Generic Name</span>
                        <span className="value">{generic}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Manufacturer</span>
                        <span className="value">{manufacturer}</span>
                      </div>
                    </div>

                    <div className="purpose-box">
                      <span className="label">Indications & Usage</span>
                      <p className="purpose-text">
                        {purpose.slice(0, 240)}
                        {purpose.length > 240 ? '...' : ''}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;