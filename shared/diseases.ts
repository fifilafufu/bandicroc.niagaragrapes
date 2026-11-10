// Diseases VIVC scores on the OIV 1 to 9 scale (1 = very susceptible, 9 = very resistant).

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
