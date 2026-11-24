export default function Logo() {
  return (
    <span className="logo">
      <svg viewBox="0 0 24 32" width="22" height="29" aria-hidden="true" focusable="false">
        <path
          d="M12 1C12 1 2 13.5 2 20a10 10 0 0 0 20 0C22 13.5 12 1 12 1Z"
          fill="var(--accent)"
          stroke="var(--ink)"
          strokeWidth="1.5"
        />
        <path
          d="M7.5 20.5a4.5 4.5 0 0 0 4.5 4.5"
          stroke="var(--ink)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <span className="logo-text">
        DRIP<span>GALORE</span>
      </span>
    </span>
  );
}