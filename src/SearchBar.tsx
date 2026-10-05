import React from 'react';
import './SearchBar.css';

interface SearchBarProps {
  query: string;
  isLoading: boolean;
  onQueryChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  query,
  isLoading,
  onQueryChange,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} className="search-bar">
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
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Search by brand name (e.g. Advil, Tylenol, Lipitor)..."
        className="search-input"
      />
      <button type="submit" disabled={isLoading} className="search-btn">
        {isLoading ? 'Searching...' : 'Search'}
      </button>
    </form>
  );
};