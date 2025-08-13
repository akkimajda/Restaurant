import React from 'react';
import type { OrderType } from '../types';

type Props = {
  value: OrderType;
  onChange: (v: OrderType) => void;
};

const btn: React.CSSProperties = {
  padding: '10px 16px',
  borderRadius: 10,
  border: '1px solid #e5e7eb',
  background: '#fff',
  cursor: 'pointer',
  fontWeight: 600,
};

const active: React.CSSProperties = {
  ...btn,
  background: '#ef4444',
  color: '#fff',
  borderColor: '#ef4444',
};

export default function OrderTypeTabs({ value, onChange }: Props) {
  const mk = (v: OrderType, label: string) => (
    <button
      key={v}
      onClick={() => onChange(v)}
      style={value === v ? active : btn}
    >
      {label}
    </button>
  );

  return (
    <div style={{ display: 'flex', gap: 12 }}>
      {mk('delivery', 'Delivery')}
      {mk('onplace',  'On place')}
      {mk('glovo',    'Glovo')}
    </div>
  );
}
