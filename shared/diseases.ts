// Diseases VIVC scores on the OIV 1 to 9 scale (1 = very susceptible, 9 = very resistant).

import type { Lang } from "./i18n";
import { DISEASE_NAMES_PL } from "./i18n/pl/grow";

export type DiseaseKey = "downy" | "powdery" | "blackRot" | "botrytis" | "anthracnose" | "phomopsis" | "pierces";

export const DISEASE_NAMES: Record<DiseaseKey, string> = {
  downy: "Downy mildew",
  powdery: "Powdery mildew",
  blackRot: "Black rot",
  botrytis: "Botrytis bunch rot",
  anthracnose: "Anthracnose",
  phomopsis: "Phomopsis (excoriose)",
  pierces: "Pierce's disease",
};

export const resistanceWord = (score: number) => (score <= 3 ? "susceptible" : score < 7 ? "medium" : "resistant");

export const diseaseName = (key: DiseaseKey, lang: Lang) => (lang === "pl" ? DISEASE_NAMES_PL : DISEASE_NAMES)[key];

// "downy mildew, black rot" in the chosen language.
export const diseaseList = (keys: DiseaseKey[], lang: Lang) => keys.map((k) => diseaseName(k, lang).toLowerCase()).join(", ");
