export type PieceId = "nose" | "body" | "fins";

const PIECE_SIZE: Record<PieceId, { width: number; height: number; viewBox: string }> = {
  nose: { width: 90, height: 52, viewBox: "0 0 120 70" },
  body: { width: 90, height: 82, viewBox: "0 0 120 110" },
  fins: { width: 90, height: 52, viewBox: "0 0 120 70" },
};

export function pieceDimensions(id: PieceId) {
  return PIECE_SIZE[id];
}

export function RocketPieceArt({ id, color }: { id: PieceId; color: string }) {
  const { width, height, viewBox } = PIECE_SIZE[id];
  return (
    <svg width={width} height={height} viewBox={viewBox} aria-hidden="true">
      {id === "nose" && (
        <>
          <polygon points="60,4 92,66 28,66" fill={color} />
          <circle cx="60" cy="48" r="6" fill="white" fillOpacity="0.55" />
        </>
      )}
      {id === "body" && (
        <>
          <rect x="28" y="0" width="64" height="110" rx="10" fill={color} />
          <circle cx="60" cy="42" r="16" fill="white" fillOpacity="0.85" />
          <circle cx="60" cy="42" r="9" fill={color} fillOpacity="0.35" />
        </>
      )}
      {id === "fins" && (
        <>
          <rect x="28" y="0" width="64" height="50" fill={color} />
          <polygon points="28,10 4,66 28,50" fill={color} />
          <polygon points="92,10 116,66 92,50" fill={color} />
          <rect x="46" y="50" width="10" height="18" fill={color} fillOpacity="0.7" />
          <rect x="64" y="50" width="10" height="18" fill={color} fillOpacity="0.7" />
        </>
      )}
    </svg>
  );
}
