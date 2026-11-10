import { useMemo } from "react";

// A wine glass drawn in code. The wine's colour fades from its core to a lighter rim at the edge (how
// tasters judge age), and sparkling wines get rising bubbles: more pressure, more bubbles.
// Bubbles stand still when the device asks for reduced motion (see index.css).

type Props = { core: string; rim: string; rimWidth: number; pressureBar: number; label: string };

export default function WineGlass({ core, rim, rimWidth, pressureBar, label }: Props) {
  const count = Math.round(pressureBar * 5); // semi-sparkling about 10, sparkling about 30
  const bubbles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        // Spread bubbles across the bowl in a fixed (not random) pattern, so it doesn't flicker on redraws.
        const x = 74 + ((i * 37) % 52);
        const size = 1.2 + ((i * 7) % 5) * 0.35;
        const delay = ((i * 0.53) % 3).toFixed(2);
        const duration = (2.2 + ((i * 3) % 7) * 0.25).toFixed(2);
        return { x, size, delay, duration };
      }),
    [count],
  );
  const coreStop = Math.max(0.5, 1 - rimWidth * 2.4);

  return (
    <svg viewBox="0 0 200 260" className="wine-glass" role="img" aria-label={label}>
      <defs>
        <radialGradient id="wine-fill" cx="50%" cy="38%" r="62%">
          <stop offset="0" stopColor={core} />
          <stop offset={coreStop} stopColor={core} />
          <stop offset="1" stopColor={rim} />
        </radialGradient>
        <clipPath id="bowl">
          <path d="M52 30 H148 C152 96 140 140 100 152 C60 140 48 96 52 30 Z" />
        </clipPath>
        <linearGradient id="shine" x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* wine */}
      <g clipPath="url(#bowl)">
        <rect x="40" y="70" width="120" height="90" fill="url(#wine-fill)" />
        <ellipse cx="100" cy="70" rx="47" ry="5" fill={rim} opacity="0.9" />
        {bubbles.map((b, i) => (
          <circle
            key={i}
            className="fizz"
            cx={b.x}
            cy={148}
            r={b.size}
            style={{ animationDelay: `${b.delay}s`, animationDuration: `${b.duration}s` }}
          />
        ))}
      </g>

      {/* glass */}
      <path d="M52 30 H148 C152 96 140 140 100 152 C60 140 48 96 52 30 Z" className="glass-outline" />
      <path d="M62 40 C60 80 64 112 80 130" stroke="url(#shine)" strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M100 152 V226" className="glass-outline" />
      <ellipse cx="100" cy="230" rx="40" ry="7" className="glass-outline" />
    </svg>
  );
}
