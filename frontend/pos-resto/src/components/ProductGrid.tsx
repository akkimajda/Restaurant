// src/components/ProductGrid.tsx
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
        gap: 16,
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        padding: '8px 0',
      }}
    >
      {products.map((p) => (
        <ProductCard key={p.id} p={p} onAdd={onAdd} />
      ))}
    </div>
  );
}

function ProductCard({ p, onAdd }: { p: Product; onAdd: (p: Product) => void }) {
  const cardStyle: React.CSSProperties = {
    width: '100%',
    textAlign: 'left',
    padding: 14,
    borderRadius: 12,
    border: '1px solid #e5e7eb',
    background: '#fff',
    transition: 'box-shadow .2s, transform .05s',
    cursor: 'pointer',
  };

  // On accepte plusieurs shapes possibles: image / image_url / imageUrl
  const img =
    (p as any).image ?? (p as any).image_url ?? (p as any).imageUrl ?? '';

  // Fallback si l’image demandée n’existe pas
  const fallback = 'https://via.placeholder.com/600x400?text=No+image';

  return (
    <button onClick={() => onAdd(p)} style={cardStyle}>
      <img
        src={img || fallback}
        alt={p.name}
        loading="lazy"
        onError={(e) => {
          if (e.currentTarget.src !== fallback) {
            e.currentTarget.src = fallback;
          }
        }}
        style={{
          width: '100%',
          height: 140,
          objectFit: 'cover',
          borderRadius: 10,
          background: '#f1f5f9',
          display: 'block',
          marginBottom: 8,
        }}
      />

      <div style={{ fontWeight: 600, marginBottom: 4 }}>{p.name}</div>
      <div style={{ color: '#6b7280' }}>
        {Number(p.price).toFixed(2)} MAD
      </div>
    </button>
  );
}
