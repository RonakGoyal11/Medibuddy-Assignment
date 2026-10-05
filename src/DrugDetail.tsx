import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { type DrugLabelResult, type FdaApiResponse } from './types';
import './DrugDetail.css';

export const DrugDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [drug, setDrug] = useState<DrugLabelResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDrugDetail = async () => {
      if (!id) {
        setError('No valid drug ID provided.');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const decodedId = decodeURIComponent(id);
        const endpoint = `https://api.fda.gov/drug/label.json?search=id:"${encodeURIComponent(decodedId)}"&limit=1`;

        const response = await fetch(endpoint);

        if (response.status === 404) {
          setError('Medicine record not found in the FDA database.');
          return;
        }

        if (!response.ok) {
          throw new Error(`Failed to load data (Status: ${response.status})`);
        }

        const data: FdaApiResponse = await response.json();
        if (data.results && data.results.length > 0) {
          setDrug(data.results[0]);
        } else {
          setError('No monograph information available for this record.');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDrugDetail();
  }, [id]);

  const fda = drug?.openfda;
  const brandName = fda?.brand_name?.[0] || 'Unknown Brand';
  const genericName = fda?.generic_name?.join(', ') || 'N/A';
  const manufacturer = fda?.manufacturer_name?.join(', ') || 'N/A';
  const productType = fda?.product_type?.[0] || 'Human OTC / Prescription Drug';
  const route = fda?.route?.join(', ') || 'Standard';

  return (
    <div className="detail-page-layout">
      <Navbar />

      <main className="detail-container">
        {/* Navigation Back */}
        <button onClick={() => navigate(-1)} className="back-link-btn">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Search Results
        </button>

        {isLoading && (
          <div className="detail-state-box">
            <div className="gentle-spinner"></div>
            <p>Fetching drug monograph from FDA database...</p>
          </div>
        )}

        {error && !isLoading && (
          <div className="detail-state-box error-notice">
            <h2>Record Unavailable</h2>
            <p>{error}</p>
            <button onClick={() => navigate('/')} className="home-fallback-btn">
              Go to Home Search
            </button>
          </div>
        )}

        {!isLoading && drug && (
          <article className="monograph-card">
            {/* Header Section */}
            <header className="monograph-header">
              <span className="badge-pill">{productType}</span>
              <h1 className="monograph-title">{brandName}</h1>
              <p className="monograph-subtitle">
                <strong>Generic:</strong> {genericName}
              </p>
            </header>

            {/* openFDA Quick Identity Strip */}
            <section className="identity-strip">
              <div className="strip-item">
                <span className="strip-label">Manufacturer</span>
                <span className="strip-val">{manufacturer}</span>
              </div>
              <div className="strip-item">
                <span className="strip-label">Administration Route</span>
                <span className="strip-val">{route}</span>
              </div>
              <div className="strip-item">
                <span className="strip-label">FDA Document ID</span>
                <span className="strip-val mono">{drug.id}</span>
              </div>
              {fda?.package_ndc && (
                <div className="strip-item">
                  <span className="strip-label">Primary NDC</span>
                  <span className="strip-val mono">{fda.package_ndc[0]}</span>
                </div>
              )}
            </section>

            {/* Extended Clinical Sections */}
            <section className="monograph-body">
              {drug.indications_and_usage && (
                <div className="monograph-section">
                  <h3>Indications & Usage</h3>
                  <p>{drug.indications_and_usage.join(' ')}</p>
                </div>
              )}

              {drug.purpose && (
                <div className="monograph-section">
                  <h3>Purpose</h3>
                  <p>{drug.purpose.join(' ')}</p>
                </div>
              )}

              {drug.dosage_and_administration && (
                <div className="monograph-section">
                  <h3>Dosage & Administration</h3>
                  <p>{drug.dosage_and_administration.join(' ')}</p>
                </div>
              )}

              {drug.active_ingredient && (
                <div className="monograph-section">
                  <h3>Active Ingredients</h3>
                  <p>{drug.active_ingredient.join(' ')}</p>
                </div>
              )}

              {drug.warnings && (
                <div className="monograph-section warning-section">
                  <h3>Warnings & Precautions</h3>
                  <p>{drug.warnings.join(' ')}</p>
                </div>
              )}

              {drug.storage_and_handling && (
                <div className="monograph-section">
                  <h3>Storage & Handling</h3>
                  <p>{drug.storage_and_handling.join(' ')}</p>
                </div>
              )}
            </section>
          </article>
        )}
      </main>
    </div>
  );
};