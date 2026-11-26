export function LoadingBlock({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="status-block" role="status">
      <span className="spinner" aria-hidden="true" />
      {label}
    </div>
  );
}

export function LoadError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="status-block" role="alert">
      <p>Sorry, we couldn't load the products. Please check your connection.</p>
      <button type="button" className="btn" onClick={onRetry}>Try again</button>
    </div>
  );
}