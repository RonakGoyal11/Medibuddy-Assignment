import React from 'react';
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
  const brand = item.openfda?.brand_name?.join(', ') || 'Unspecified Brand';
  const generic = item.openfda?.generic_name?.join(', ') || 'N/A';
  const manufacturer = item.openfda?.manufacturer_name?.join(', ') || 'N/A';
  const route = item.openfda?.route?.[0] || 'Standard';
  const purpose =
    item.purpose?.[0] ||
    item.indications_and_usage?.[0] ||
    'No clinical monograph summary available.';

  const imageUrl = DRUG_IMAGES[index % DRUG_IMAGES.length];
  const targetId = encodeURIComponent(item.id || `item-${index}`);

  return (
    <li className="drug-card">
      <div className="card-image-wrapper">
        <img src={imageUrl} alt={brand} className="card-image" loading="lazy" />
        <span className="route-tag">{route}</span>
      </div>

      <div className="card-body">
        <h2 className="drug-title">{brand}</h2>

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
          <p className="purpose-text">{purpose}</p>
        </div>

        <a href={`/drug/${targetId}`} className="more-btn">
          More
          <svg className="btn-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </li>
  );
};