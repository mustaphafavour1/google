export function DoodleStar({ className, color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 2C12.5 7 13 10 19 12C13 14 12.5 17 12 22C11.5 17 11 14 5 12C11 10 11.5 7 12 2Z"
        fill={color}
      />
    </svg>
  );
}
