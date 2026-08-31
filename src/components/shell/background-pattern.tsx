export function BackgroundPattern() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 text-ink-faint opacity-[0.05] dark:opacity-[0.08]"
    >
      <svg width="100%" height="100%">
        <pattern
          id="geo-weave"
          x="0"
          y="0"
          width="72"
          height="72"
          patternUnits="userSpaceOnUse"
        >
          <path d="M36 6 L66 36 L36 66 L6 36 Z" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M36 24 L48 36 L36 48 L24 36 Z" fill="currentColor" />
          <path d="M0 0 L14 0 L0 14 Z" fill="currentColor" />
          <path d="M72 0 L58 0 L72 14 Z" fill="currentColor" />
          <path d="M0 72 L14 72 L0 58 Z" fill="currentColor" />
          <path d="M72 72 L58 72 L72 58 Z" fill="currentColor" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#geo-weave)" />
      </svg>
    </div>
  );
}
