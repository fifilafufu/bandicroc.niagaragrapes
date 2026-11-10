// The grapevine's year, from Wikipedia "Annual growth cycle of grapevines" (checked 2026-11-10).
// Months are the usual ones for each hemisphere; the real dates move with the weather and the variety.
// start/end place each stage on the wheel, in months (1 = start of January, 5.5 = mid-May) for the
// Northern Hemisphere; the Southern Hemisphere is about six months later. Stages touch end to end, so
// "fruit set" also covers the weeks of hard green berries before véraison.

export type Stage = { id: string; name: string; icon: string; start: number; end: number; when: string; text: string };

export const STAGES: Stage[] = [
  {
    id: "budbreak",
    name: "Budbreak",
    icon: "🌱",
    start: 3,
    end: 5,
    when: "Around March (September in the south), when days pass about 10 °C",
    text: "Buds swell and the first green shoots appear. Pruned vines “bleed” sap from their cuts first. Young shoots are easily killed by frost.",
  },
  {
    id: "flowering",
    name: "Flowering",
    icon: "🌼",
    start: 5,
    end: 5.5,
    when: "Around May (November in the south), 40 to 80 days after budbreak, at 15 to 20 °C",
    text: "Tiny flower clusters open. Most cultivated vines pollinate themselves; wind and insects help only a little.",
  },
  {
    id: "fruitset",
    name: "Fruit set",
    icon: "🟢",
    start: 5.5,
    end: 7.6,
    when: "Right after flowering, in May (November in the south)",
    text: "Fertilised flowers become small, hard, green berries; the rest fall off. On average about 30% of flowers become berries. This sets how big the harvest can be. The berries then grow, green and sour, until véraison.",
  },
  {
    id: "veraison",
    name: "Véraison",
    icon: "🍇",
    start: 7.6,
    end: 9,
    when: "End of July into August (end of January into February in the south), 40 to 50 days after fruit set",
    text: "Ripening starts: berries soften and change colour, red or black for dark grapes, yellow-green for white ones.",
  },
  {
    id: "harvest",
    name: "Harvest",
    icon: "🧺",
    start: 9,
    end: 11,
    when: "September to October (February to April in the south)",
    text: "As grapes ripen, sugar and pH go up and acids such as malic acid go down. Growers pick when the balance is right for what they want to make.",
  },
  {
    id: "dormancy",
    name: "Leaf fall & dormancy",
    icon: "❄️",
    start: 11,
    end: 15, // wraps past December to the end of February
    when: "After the first frost, through winter",
    text: "After harvest the vine stores food in its roots and trunk. Leaves turn yellow and fall, and the vine rests through winter until spring.",
  },
];

export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
