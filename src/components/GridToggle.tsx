const OPTIONS = [1, 2, 3, 4];

interface Props {
  value: number;
  onChange: (cols: number) => void;
}

export default function GridToggle({ value, onChange }: Props) {
  return (
    <div className="grid-toggle" role="group" aria-label="Items per row">
      {OPTIONS.map((n) => (
        <button
          key={n}
          type="button"
          className={`grid-btn grid-btn-${n}`}
          aria-pressed={value === n}
          aria-label={`${n} per row`}
          title={`${n} per row`}
          onClick={() => onChange(n)}
        >
          <span className="grid-icon" style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
            {Array.from({ length: n }, (_, i) => (
              <span key={i} />
            ))}
          </span>
        </button>
      ))}
    </div>
  );
}