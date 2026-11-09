// A simple grape bunch drawing, in any colour.
const BERRIES: [number, number][] = [
  [30, 30], [50, 30], [70, 30],
  [20, 48], [40, 48], [60, 48], [80, 48],
  [30, 66], [50, 66], [70, 66],
  [40, 84], [60, 84],
  [50, 101],
];

export default function Bunch({ fill, shade, size = 100, label }: { fill: string; shade: string; size?: number; label: string }) {
  return (
    <svg viewBox="0 0 100 118" width={size} height={size * 1.18} role="img" aria-label={label}>
      <path d="M50 4 C50 12 50 16 50 20" stroke="var(--wood)" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M52 10 C62 2 76 4 82 10 C72 16 60 16 52 10 Z" fill="var(--leaf)" />
      {BERRIES.map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <circle cx={x} cy={y} r="10.5" fill={fill} stroke={shade} strokeWidth="1.5" />
          <circle cx={x - 3.5} cy={y - 3.5} r="2.6" fill="#fff" opacity="0.45" />
        </g>
      ))}
    </svg>
  );
}
