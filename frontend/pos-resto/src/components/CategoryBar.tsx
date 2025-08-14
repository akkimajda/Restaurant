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
  return (
    <div className="categoryBar">
      <button
        className={`chip ${value === 'all' ? 'active' : ''}`}
        onClick={() => onChange('all')}
      >
        All items
      </button>
      {categories
        .filter((c) => c.id !== 'all')
        .map((c) => (
          <button
            key={c.id}
            className={`chip ${value === c.id ? 'active' : ''}`}
            onClick={() => onChange(c.id)}
          >
            {c.name}
          </button>
        ))}
    </div>
  );
}
