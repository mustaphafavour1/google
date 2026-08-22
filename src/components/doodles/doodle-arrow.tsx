export function DoodleArrow({ className, color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 100 60" fill="none" className={className} aria-hidden="true">
      <path
        d="M6 8C28 4 58 10 70 30C76 40 74 46 68 50"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M55 45L68 51L66 37"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
