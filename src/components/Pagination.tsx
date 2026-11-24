interface Props {
  current: number;
  total: number;
  onChange: (page: number) => void;
}

export default function Pagination({ current, total, onChange }: Props) {
  if (total <= 1) return null;
  const pages = Array.from({ length: total }, (_, i) => i + 1);

  return (
    <nav className="pagination" aria-label="Pages">
      <button type="button" disabled={current === 1} onClick={() => onChange(current - 1)}>
        ← Prev
      </button>
      {pages.map((p) => (
        <button
          key={p}
          type="button"
          aria-current={p === current ? "page" : undefined}
          aria-label={`Page ${p}`}
          onClick={() => onChange(p)}
        >
          {p}
        </button>
      ))}
      <button type="button" disabled={current === total} onClick={() => onChange(current + 1)}>
        Next →
      </button>
    </nav>
  );
}