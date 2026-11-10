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

console.log(failed ? `\n${failed} check(s) failed` : "\nAll wine model checks passed");
process.exit(failed ? 1 : 0);
