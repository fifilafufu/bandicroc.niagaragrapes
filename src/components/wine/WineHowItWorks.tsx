import SourceLine from "../SourceLine";
import { MODEL_VERSION } from "../../../shared/wineSim";
import { useLang } from "../../lib/lang";

// The "How this works" notes under Make Your Wine, with their sources.
export default function WineHowItWorks() {
  const { t } = useLang();
  return (
    <details className="card how-it-works">
      <summary>{t("mw.how")}</summary>
      <ul>
        <li>
          <b>{t("mw.h1t")}</b> {t("mw.h1")}
        </li>
        <li>
          <b>{t("mw.h2t")}</b> {t("mw.h2")}
        </li>
        <li>
          <b>{t("mw.h3t")}</b> {t("mw.h3")}
        </li>
        <li>
          <b>{t("mw.h4t")}</b> {t("mw.h4")}
        </li>
        <li>
          <b>{t("mw.h5t")}</b> {t("mw.h5")}
        </li>
        <li>
          <b>{t("mw.h6t")}</b> {t("mw.h6", { v: MODEL_VERSION })}
        </li>
      </ul>
      <SourceLine
        ids={["oiv-sugar-alcohol", "eu-2019-33", "gp-concord-2014", "oiv-code"]}
        wiki={[
          { label: "Ripeness in viticulture", title: "Ripeness in viticulture" },
          { label: "Traditional method", title: "Traditional method" },
          { label: "Sparkling wine", title: "Sparkling wine" },
          { label: "Phenolic content in wine", title: "Phenolic content in wine" },
          { label: "Oak (wine)", title: "Oak (wine)" },
        ]}
      />
    </details>
  );
}
