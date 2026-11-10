// The five official grape skin colour classes (OIV descriptor "berry: colour of skin", as used by VIVC),
// each with a real example checked on its VIVC passport page (2026-11-10).

export const vivc = (id: number) => `https://www.vivc.de/index.php?r=passport%2Fview&id=${id}`;

export const CLASSES = [
  {
    cls: "Blanc",
    meaning: "white",
    note: "really green to yellow, even bronze",
    hex: "#b9cf5a",
    grape: "Niagara",
    wiki: "Niagara (grape)",
    vivcId: 8537,
    also: "Shine Muscat, Scuppernong, Sultana",
  },
  { cls: "Rose", meaning: "pink", note: "pale pink skin", hex: "#e79bb0", grape: "Gewürztraminer", wiki: "Gewürztraminer", vivcId: 12609 },
  { cls: "Gris", meaning: "grey", note: "greyish pink to brownish", hex: "#a58a8f", grape: "Pinot Gris", wiki: "Pinot gris", vivcId: 9275 },
  { cls: "Rouge", meaning: "red", note: "light to deep red", hex: "#b0243c", grape: "Red Globe", wiki: "Red Globe", vivcId: 9972, also: "Catawba, Delaware" },
  { cls: "Noir", meaning: "black", note: "really dark blue to blue-black", hex: "#2b2140", grape: "Concord", wiki: "Concord grape", vivcId: 2801, also: "Cabernet Sauvignon" },
];
