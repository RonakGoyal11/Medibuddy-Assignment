import React from 'react';
import './Navbar.css';

export const Navbar: React.FC = () => {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <a href="/" className="navbar-brand">
          <span className="brand-dot"></span>
          PharmaVerify
        </a>

        <nav className="navbar-links">
          <a href="#explore" className="nav-link">Explore</a>
          <a href="#database" className="nav-link">Database</a>
          <a href="#docs" className="nav-link">Docs</a>
        </nav>

        <div className="navbar-actions">
          <button type="button" className="btn-text">Log in</button>
          <button type="button" className="btn-primary">Sign up</button>
        </div>
      </div>
    </header>
  );
};