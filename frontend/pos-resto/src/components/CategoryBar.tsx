import { useMemo } from 'react';

type Category = { id: string; name: string };

export default function CategoryBar({
  categories,
  value,
  onChange,
}: {
  categories: Category[];
  value: string;
  onChange: (id: string) => void;
}) {
  // Dé-dupliquer au cas où l’API renvoie des doublons
  const uniqueCats = useMemo(() => {
    const seen = new Set<string>();
    return categories.filter((c) => {
      if (c.id === 'all') return false; // on gère 'All items' manuellement
      if (seen.has(c.id)) return false;
      seen.add(c.id);
      return true;
    });
  }, [categories]);

  return (
    <div className="categoryBar">
      <button
        className={`chip ${value === 'all' ? 'active' : ''}`}
        onClick={() => onChange('all')}
        aria-pressed={value === 'all'}
      >
        All items
      </button>

      {uniqueCats.map((c) => (
        <button
          key={c.id}
          className={`chip ${value === c.id ? 'active' : ''}`}
          onClick={() => onChange(c.id)}
          aria-pressed={value === c.id}
        >
          {c.name}
        </button>
      ))}
    </div>
  );
}
