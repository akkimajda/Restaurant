import React from 'react';
import type { CartLine } from '../types';

type Props = {
  lines: CartLine[];
  onInc: (productId: string) => void;
  onDec: (productId: string) => void;
  onRemove: (productId: string) => void;
};

export default function CartPanel({ lines, onInc, onDec, onRemove }: Props) {
  const total = lines.reduce((s, l) => s + l.product.price * l.qty, 0);

  return (
    <div style={{
      borderLeft: '1px solid #e5e7eb',
      padding: 16,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }}>
      <h3 style={{ margin: 0 }}>🧾 Panier</h3>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {lines.length === 0 && <div style={{ color: '#6b7280' }}>Panier vide…</div>}
        {lines.map(l => (
          <div key={l.product.id} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            border: '1px solid #e5e7eb', borderRadius: 10, padding: 8
          }}>
            <div>
              <div style={{ fontWeight: 700 }}>{l.product.name}</div>
              <div style={{ color: '#6b7280', fontSize: 12 }}>
                {l.product.price.toFixed(2)} MAD
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button onClick={() => onDec(l.product.id)} style={btn}>-</button>
              <div style={{ minWidth: 24, textAlign: 'center' }}>{l.qty}</div>
              <button onClick={() => onInc(l.product.id)} style={btn}>+</button>
              <button onClick={() => onRemove(l.product.id)} style={dangerBtn}>×</button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <strong>Total</strong>
          <strong>{total.toFixed(2)} MAD</strong>
        </div>
        <button style={primaryBtn} disabled={lines.length === 0}>Proceed Order</button>
      </div>
    </div>
  );
}

const btn: React.CSSProperties = {
  border: '1px solid #e5e7eb',
  background: '#fff',
  borderRadius: 6,
  width: 28,
  height: 28,
  cursor: 'pointer',
};

const dangerBtn: React.CSSProperties = {
  ...btn,
  color: '#ef4444',
  fontWeight: 900,
};

const primaryBtn: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  background: '#ef4444',
  color: '#fff',
  border: '1px solid #ef4444',
  borderRadius: 10,
  cursor: 'pointer',
  fontWeight: 700,
};
