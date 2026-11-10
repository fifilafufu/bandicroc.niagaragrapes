// Checks the shared wine model against its sources. Run: node scripts/test-wine.ts
import { abvFromSugar, balance, ferment, sparklingSweetness, stillSweetness, SUGAR_PER_ABV } from "../shared/wine.ts";
import { brixToSugar, defaultInputs, makeWine, type Inputs } from "../shared/wineSim.ts";
import { simGrape } from "../shared/simGrapes.ts";

let failed = 0;
function check(name: string, got: unknown, want: unknown) {
  const ok = typeof want === "number" ? Math.abs((got as number) - want) < 0.05 : got === want;
  if (!ok) failed++;
  console.log(`${ok ? "ok  " : "FAIL"} ${name}: got ${JSON.stringify(got)}${ok ? "" : `, want ${JSON.stringify(want)}`}`);
}

// OIV: sugar × 0.05943 = % vol
check("16.83 g/L sugar per 1% ABV", SUGAR_PER_ABV, 16.83);
check("170 g/L sugar → 10.1% potential alcohol", abvFromSugar(170), 10.1);

// Alcohol only from fermented sugar; yeast limit leaves the rest sweet
const concord = ferment(160, 1);
check("Concord-like 160 g/L fully fermented → 9.5%", concord.abv, 9.51);
check("…leaves no sugar", concord.residualSugar, 0);
const stop = ferment(160, 0.75);
check("Stop at 75% → 7.1%", stop.abv, 7.13);
check("…leaves 40 g/L sugar", stop.residualSugar, 40);
const huge = ferment(320, 1);
check("320 g/L sugar: yeast stops at 15.5%", huge.abv, 15.5);
check("…so about 59 g/L stays sweet", huge.residualSugar, 59.2);
check("…and says the yeast stopped it", huge.stoppedByYeast, true);

// EU 2019/33 Annex III, Part B (still wines)
check("3 g/L → dry", stillSweetness(3, 5), "dry");
check("8 g/L with acidity 7 → dry (acid within 2 g)", stillSweetness(8, 7), "dry");
check("8 g/L with acidity 5 → medium dry", stillSweetness(8, 5), "medium dry");
check("15 g/L with acidity 6 → medium dry (acid within 10 g)", stillSweetness(15, 6), "medium dry");
check("15 g/L with acidity 4 → medium sweet", stillSweetness(15, 4), "medium sweet");
check("44 g/L → medium sweet", stillSweetness(44, 6), "medium sweet");
check("45 g/L → sweet", stillSweetness(45, 6), "sweet");

// EU 2019/33 Annex III, Part A (sparkling)
check("2 g/L, nothing added → brut nature", sparklingSweetness(2, false), "brut nature");
check("2 g/L, sugar added → extra brut", sparklingSweetness(2, true), "extra brut");
check("8 g/L → brut", sparklingSweetness(8, true), "brut");
check("14 g/L → extra dry", sparklingSweetness(14, true), "extra dry");
check("25 g/L → dry", sparklingSweetness(25, true), "dry");
check("40 g/L → demi-sec", sparklingSweetness(40, true), "medium dry (demi-sec)");
check("60 g/L → doux", sparklingSweetness(60, true), "sweet (doux)");

// Balance
check("even wine is balanced", balance({ acidity: 0.5, tannin: 0.5, sweetness: 0.4, alcohol: 0.6 }).verdict, "balanced");
check("sweet, low acid → too soft", balance({ acidity: 0.2, tannin: 0, sweetness: 0.9, alcohol: 0.4 }).verdict, "too soft");
check("tannic, sour, dry → too firm", balance({ acidity: 0.8, tannin: 0.8, sweetness: 0, alcohol: 0.4 }).verdict, "too firm");

// ---------- Make Your Wine (the approved check cases) ----------
const g = (n: string) => simGrape(n)!;
const wine = (n: string, over: Partial<Inputs>) => makeWine(g(n), { ...defaultInputs(g(n)), ...over });
const has = (s: string, word: string) => s.includes(word);

check("OIV table: 22 °Brix = 214.7 g/L", brixToSugar(22), 214.7);
check("OIV table: 16.5 °Brix ≈ 152.7 g/L", brixToSugar(16.5), 152.65);

const youngCab = wine("Cabernet Sauvignon", { skinDays: 14, oak: "new", oakMonths: 12, bottleYears: 0 });
check("young Cabernet is red", youngCab.style, "red");
check("young Cabernet looks deep purple", has(youngCab.colour.words, "deep purple"), true);
check("young Cabernet has firm tannin", youngCab.tannin > 0.6, true);

const oldRed = wine("Merlot", { skinDays: 14, bottleYears: 10 });
check("10-year Merlot: garnet core", has(oldRed.colour.words, "garnet"), true);
check("10-year Merlot: tawny rim", has(oldRed.colour.words, "tawny rim"), true);
check("…its tannin has softened", oldRed.tannin < wine("Merlot", { skinDays: 14, bottleYears: 0 }).tannin, true);

const riesling = wine("Riesling", { bottleYears: 0 });
check("young unoaked Riesling is pale lemon-green", riesling.colour.words, "pale lemon-green");
check("…and has no tannin", riesling.tannin, 0);
check("…and is balanced", riesling.balance.verdict, "balanced");

const chard = wine("Chardonnay", { oak: "new", oakMonths: 12, bottleYears: 3, mlf: 1 });
check("oaked 3-year Chardonnay is gold", has(chard.colour.words, "gold"), true);
check("…smells of vanilla and butter", chard.aromas.includes("vanilla") && chard.aromas.some((a) => a.startsWith("butter")), true);
check("unoaked Chardonnay has no oak butter", wine("Chardonnay", { oak: "none", mlf: 0 }).aromas.some((a) => a.includes("oak")), false);

const rose = wine("Grenache", { skinDays: 0.25, mlf: 0 });
check("6-hour Grenache is a rosé", rose.style, "rosé");
check("…pale salmon", rose.colour.words, "pale salmon");

check("2 weeks of skin contact on Pinot Gris → orange wine", wine("Pinot Gris", { skinDays: 14 }).style, "orange");
check("dark grapes pressed straight away → almost white", wine("Pinot Noir", { skinDays: 0 }).style, "white");
check("tannin only with skin contact or oak", wine("Cabernet Sauvignon", { skinDays: 0, oak: "none" }).tannin, 0);

// Concord can't be both strong and sweet
check("dry Concord only reaches about 9%", wine("Concord", { fermentPct: 100 }).abv < 9.5, true);
const sweetConcord = wine("Concord", { fermentPct: 70 });
check("sweeter Concord is weaker still", sweetConcord.abv < 7, true);
check("…and is labelled sweet", sweetConcord.sweetnessWord, "sweet");

// Bubbles
const fizz = wine("Chardonnay", { bubbles: "sparkling", dosage: 8 });
check("traditional method: 6 bar", fizz.pressureBar, 6);
check("…adds about 1.1% alcohol", fizz.abv - wine("Chardonnay", {}).abv, 1.07);
check("…8 g/L dosage = brut", fizz.sweetnessWord, "brut");
check("no dosage, fully fermented = brut nature", wine("Chardonnay", { bubbles: "sparkling", dosage: 0 }).sweetnessWord, "brut nature");
check("semi-sparkling = 2 bar", wine("Riesling", { bubbles: "semi" }).pressureBar, 2);
check("still wine has no bubbles", wine("Riesling", {}).pressureBar, 0);

console.log(failed ? `\n${failed} check(s) failed` : "\nAll wine model checks passed");
process.exit(failed ? 1 : 0);
