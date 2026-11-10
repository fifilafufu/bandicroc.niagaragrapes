// Questions built from the grape data: VIVC passports and Commons photos (varietyData.json),
// growing traits (grow.ts) and VIVC disease-resistance scores. New grapes there become new questions.
// The wording comes from text.ts (English) or its Polish twin; answers and sources are the same.

import { VARIETIES, niceCase } from "../varieties";
import { CLASSES } from "../colourClasses";
import type { DiseaseKey } from "../diseases";
import { GROW, type GrowInfo } from "../grow";
import type { SourceId } from "../sources";
import { sample, withWrong } from "./random";
import type { QuizText } from "./text";
import type { ChoiceQ } from "./types";

const vivcQ = (name: string, wiki: string, rest: Omit<ChoiceQ, "kind" | "cat" | "level" | "src" | "wiki">): ChoiceQ => ({
  kind: "choice",
  cat: "varieties",
  level: "pro",
  src: ["vivc"],
  wiki: [wiki],
  ...rest,
  id: `${rest.id}:${name}`,
});

function photoQs(t: QuizText): ChoiceQ[] {
  const withPhoto = VARIETIES.filter(([, v]) => v.photo).map(([name]) => name);
  return VARIETIES.filter(([, v]) => v.photo).map(([name, v]) => {
    const cls = CLASSES.find((c) => c.cls.toLowerCase() === v.vivc?.colour);
    return {
      kind: "choice",
      id: `photo:${name}`,
      cat: "varieties",
      level: "newbie",
      photo: name,
      q: t.photoQ,
      ...withWrong(name, withPhoto),
      why: t.photoWhy(name, cls),
      src: cls ? ["vivc"] : undefined,
      wiki: [v.wiki],
    };
  });
}

function passportQs(t: QuizText): ChoiceQ[] {
  const out: ChoiceQ[] = [];
  const origins = VARIETIES.map(([, v]) => v.vivc?.origin).filter((o): o is string => !!o).map(t.origin);
  // Only clear "parent × parent" crosses: no unknown parents, mutations or breeding numbers.
  const crosses = VARIETIES.filter(([, v]) => /\sX\s/.test(v.vivc?.pedigree ?? "") && !/[?\d=]|MUTATION/.test(v.vivc!.pedigree!));
  const parents = crosses.map(([, v]) => niceCase(v.vivc!.pedigree!));

  for (const [name, v] of VARIETIES) {
    const p = v.vivc;
    if (!p) continue;
    const cls = CLASSES.find((c) => c.cls.toLowerCase() === p.colour);
    if (cls)
      out.push(
        vivcQ(name, v.wiki, {
          id: "colour",
          q: t.colourQ(name),
          options: CLASSES.map((c) => `${c.cls} (${t.classMeaning(c.cls)})`),
          answer: CLASSES.indexOf(cls),
          why: t.colourWhy(name, cls.cls),
        }),
      );
    if (p.origin) {
      const origin = t.origin(p.origin);
      out.push(vivcQ(name, v.wiki, { id: "origin", q: t.originQ(name), ...withWrong(origin, origins), why: t.originWhy(name, origin) }));
    }
    if (crosses.some(([n]) => n === name)) {
      const right = niceCase(p.pedigree!);
      out.push(vivcQ(name, v.wiki, { id: "parents", q: t.parentsQ(name), ...withWrong(right, parents), why: t.parentsWhy(name, right) }));
    }
  }
  return out;
}

// "Which of these grapes … ?" One grape with the trait against three without it. Sources of all four
// are shown, because the wrong answers are facts too.
function traitQ(id: string, q: string, right: string, wrong: string[], why: string): ChoiceQ {
  const names = [right, ...wrong];
  const src = [...new Set(names.flatMap((n) => GROW[n].src.ids ?? []))] as SourceId[];
  const wiki = [...new Set(names.flatMap((n) => GROW[n].src.wiki ?? []))];
  return { kind: "choice", id, cat: "growing", level: "pro", q, options: names, answer: 0, why, src, wiki };
}

function growQs(t: QuizText): ChoiceQ[] {
  const out: ChoiceQ[] = [];
  const grapes = Object.entries(GROW);
  const having = (test: (g: GrowInfo) => boolean) => grapes.filter(([, g]) => test(g)).map(([n]) => n);

  const early = having((g) => g.budding === "early");
  const notEarly = having((g) => g.budding === "late");
  for (const name of early) {
    const wrong = sample(notEarly, 3);
    out.push(traitQ(`bud:${name}`, t.budQ, name, wrong, t.budWhy(name, wrong, GROW[name].frostRisk)));
  }

  const ripeEarly = having((g) => g.ripening === "early");
  const ripeLate = having((g) => g.ripening === "late");
  for (const name of ripeEarly) {
    const wrong = sample(ripeLate, 3);
    out.push(traitQ(`ripe:${name}`, t.ripeQ, name, wrong, t.ripeWhy(name, wrong)));
  }

  for (const [name, g] of grapes) {
    if (!g.pruning) continue;
    const why = t.pruneWhy(name, g.pruning.type, g.pruning.text);
    out.push({ ...traitQ(`prune:${name}`, t.pruneQ(name), name, [], why), options: [...t.pruneOptions], answer: g.pruning.type === "spur" ? 0 : 1 });
  }
  return out;
}

function resistanceQs(t: QuizText): ChoiceQ[] {
  const out: ChoiceQ[] = [];
  for (const d of ["downy", "powdery", "blackRot"] as DiseaseKey[]) {
    const scored = VARIETIES.filter(([, v]) => v.resistance?.[d]).map(([name, v]) => ({ name, score: v.resistance![d]!.score }));
    for (const best of scored.filter((s) => s.score >= 6)) {
      const weak = sample(scored.filter((s) => s.score <= best.score - 3).map((s) => s.name), 3);
      if (weak.length < 3) continue;
      const all = [best.name, ...weak];
      const scores = all.map((n) => `${n} ${scored.find((s) => s.name === n)!.score}`).join(", ");
      out.push({
        kind: "choice",
        id: `resist:${d}:${best.name}`,
        cat: "growing",
        level: "pro",
        q: t.resistQ(d),
        options: all,
        answer: 0,
        why: t.resistWhy(scores),
        src: ["vivc"],
      });
    }
  }
  return out;
}

export const varietyQuestions = (t: QuizText): ChoiceQ[] => [...photoQs(t), ...passportQs(t), ...growQs(t), ...resistanceQs(t)];
