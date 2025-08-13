import React from 'react';
import type { Product } from '../types';

type Props = {
  products: Product[];
  onAdd: (p: Product) => void;
};

export default function ProductGrid({ products, onAdd }: Props) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
        gap: 12,
        padding: '12px 0',
      }}
    >
      {products.map(p => (
        <button
          key={p.id}
          onClick={() => onAdd(p)}
          style={{
            textAlign: 'left',
            borderRadius: 12,
            border: '1px solid #e5e7eb',
            padding: 12,
            background: '#fff',
            cursor: 'pointer',
          }}
        >
          <div style={{ fontWeight: 700 }}>{p.name}</div>
          <div style={{ color: '#6b7280', marginTop: 4 }}>{p.price.toFixed(2)} MAD</div>
        </button>
      ))}
    </div>
  );
}
