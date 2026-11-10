// Turns a wine colour described in CIE LCh (lightness, chroma, hue angle) into a screen colour (sRGB hex).
// Used by Make Your Wine (shared/wineSim.ts).

export const clamp = (x: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, x));

export function lchToHex(L: number, C: number, hDeg: number) {
  const h = (hDeg * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);
  // Lab → XYZ (D65)
  const fy = (L + 16) / 116;
  const fx = fy + a / 500;
  const fz = fy - b / 200;
  const f3 = (t: number) => (t ** 3 > 0.008856 ? t ** 3 : (t - 16 / 116) / 7.787);
  const X = 0.95047 * f3(fx);
  const Y = 1.0 * f3(fy);
  const Z = 1.08883 * f3(fz);
  // XYZ → linear sRGB → sRGB
  const lin = [3.2406 * X - 1.5372 * Y - 0.4986 * Z, -0.9689 * X + 1.8758 * Y + 0.0415 * Z, 0.0557 * X - 0.204 * Y + 1.057 * Z];
  return (
    "#" +
    lin
      .map((v) => {
        const s = v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055;
        return Math.round(clamp(s) * 255)
          .toString(16)
          .padStart(2, "0");
      })
      .join("")
  );
}

