import React from 'react';
import { Link } from 'react-router-dom';
import { type DrugLabelResult } from '../types';
import './DrugCard.css';

interface DrugCardProps {
  item: DrugLabelResult;
  index: number;
}

const DRUG_IMAGES = [
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1550572017-ed200f5e6343?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&w=600&q=80',
];

export const DrugCard: React.FC<DrugCardProps> = ({ item, index }) => {
  const fda = item.openfda;

  const brandName = fda?.brand_name?.[0] || 'Unspecified Brand Name';
  const genericName = fda?.generic_name?.join(', ') || 'Not Listed';
  const manufacturer = fda?.manufacturer_name?.join(', ') || 'Not Listed';
  const productType = fda?.product_type?.[0] || 'Human OTC / Prescription Drug';
  const route = fda?.route?.[0] || 'Standard';
  const activeSubstance = fda?.substance_name?.slice(0, 3).join(', ') || null;
  const pharmClass = fda?.pharm_class_epc?.[0] || null;
  const ndcCode = fda?.package_ndc?.[0] || null;

  const imageUrl = DRUG_IMAGES[index % DRUG_IMAGES.length];
  const targetId = encodeURIComponent(item.id);

  return (
    <li className="drug-card">
      <div className="card-image-wrapper">
        <img src={imageUrl} alt={brandName} className="card-image" loading="lazy" />
        <span className="route-badge">{route}</span>
      </div>

      <div className="card-body">
        <div className="card-header">
          <span className="product-type-label">{productType}</span>
          <h2 className="drug-brand-title">{brandName}</h2>
        </div>

        <div className="drug-details-grid">
          <div className="detail-item">
            <span className="label">Generic Name</span>
            <span className="value strong-value">{genericName}</span>
          </div>

          <div className="detail-item">
            <span className="label">Manufacturer</span>
            <span className="value">{manufacturer}</span>
          </div>

          {activeSubstance && (
            <div className="detail-item">
              <span className="label">Active Substance</span>
              <span className="value">{activeSubstance}</span>
            </div>
          )}

          {pharmClass && (
            <div className="detail-item">
              <span className="label">Pharmacologic Class</span>
              <span className="value pharm-class-badge">{pharmClass}</span>
            </div>
          )}

          {ndcCode && (
            <div className="detail-item">
              <span className="label">Package NDC</span>
              <span className="value ndc-value">{ndcCode}</span>
            </div>
          )}
        </div>

        <Link to={`/drug/${targetId}`} className="more-btn">
          View Full Label
          <svg className="btn-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </li>
  );
};