import React from 'react';
import type { Category } from '../types';

type Props = {
  categories: Category[];
  value: string;
  onChange: (categoryId: string) => void;
};

export default function CategoryBar({ categories, value, onChange }: Props) {
  return (
    <div style={{
      display: 'flex', gap: 8, overflowX: 'auto',
      padding: '8px 0', borderBottom: '1px solid #e5e7eb'
    }}>
      {categories.map(c => {
        const active = c.id === value;
        return (
          <button
            key={c.id}
            onClick={() => onChange(c.id)}
            style={{
              padding: '8px 12px',
              borderRadius: 999,
              border: '1px solid',
              borderColor: active ? '#ef4444' : '#e5e7eb',
              background: active ? '#fee2e2' : '#fff',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            {c.name}
          </button>
        );
      })}
    </div>
  );
}
