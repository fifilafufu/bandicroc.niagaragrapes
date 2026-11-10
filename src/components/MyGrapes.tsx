import { useEffect, useRef, useState } from "react";
import { accountsAvailable, type User } from "../lib/account";
import type { Secret } from "../lib/useAuthAndFavourite";
import { GRAPES, findGrape } from "../../shared/grapes";
import GrapeCard from "./GrapeCard";
import SecretMessage from "./mygrapes/SecretMessage";
import LearnList from "./mygrapes/LearnList";
import WinesCard from "./mygrapes/WinesCard";
import type { Guest } from "../lib/useGuestMerge";
import { useLang } from "../lib/lang";
import type { TextKey } from "../../shared/i18n";



type Props = {
  user: User | null;
  favourite: string | null;
  ready: boolean;
  saveFavourite: (grape: string) => Promise<string | null>;
  secret: Secret | null;
  secretMissing: boolean;
  saveSecret: (message: string) => Promise<string | null>;
  // Not logged in: picks and notes live only in memory until the app closes.
  guest: Guest;
  setGuest: React.Dispatch<React.SetStateAction<Guest>>;
  onLogin: (mode: "in" | "up") => void;
  // Tells the app a guest just saved something, so it can ask them to log in.
  onGuestSaved: (what: TextKey) => void;
  // Opens Make Your Wine, where saved wines are listed.
  onWines: () => void;
};

export default function MyGrapes(props: Props) {
  const { user, ready, guest, setGuest } = props;
  const { t } = useLang();
  if (accountsAvailable && !ready) return <p className="muted center">{t("app.loading")}</p>;

  if (user)
    return (
      <div className="stack">
        <Picks
          favourite={props.favourite}
          saveFavourite={props.saveFavourite}
          secret={props.secret}
          secretMissing={props.secretMissing}
          saveSecret={props.saveSecret}
        />
        <WinesCard onOpen={props.onWines} />
        <LearnList />
      </div>
    );

  // Guest mode: everything works, but nothing is saved.
  return (
    <div className="stack">
      <section className="card guest-banner" role="note">
        <span aria-hidden="true">⏳</span>
        <div>
          <b>{t("mine.notLoggedIn")}</b>
          <p className="muted small">
            {t("mine.guestText")}
            {accountsAvailable ? t("mine.guestLogIn") : t("mine.guestNoSave")}
          </p>
          {accountsAvailable && (
            <div className="hero-actions left">
              <button className="primary small-btn" onClick={() => props.onLogin("in")}>
                {t("mine.logInSave")}
              </button>
              <button className="link" onClick={() => props.onLogin("up")}>
                {t("mine.create")}
              </button>
            </div>
          )}
        </div>
      </section>
      <Picks
        guest
        favourite={guest.favourite}
        saveFavourite={async (grape) => {
          setGuest((g) => ({ ...g, favourite: grape }));
          props.onGuestSaved("mine.whatFav");
          return null;
        }}
        secret={{ message: guest.notes, updatedAt: guest.notesAt }}
        secretMissing={false}
        saveSecret={async (message) => {
          setGuest((g) => ({ ...g, notes: message, notesAt: new Date().toISOString() }));
          props.onGuestSaved("mine.whatNote");
          return null;
        }}
      />
      <WinesCard onOpen={props.onWines} />
      <LearnList />
    </div>
  );
}

type PicksProps = Pick<Props, "favourite" | "saveFavourite" | "secret" | "secretMissing" | "saveSecret"> & { guest?: boolean };

function Picks(props: PicksProps) {
  const { favourite, saveFavourite, guest } = props;
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLang();

  // Collapsed it only shows your pick; open it to choose another. Starts open if nothing is picked yet.
  const [pickerOpen, setPickerOpen] = useState(!favourite);
  // The favourite loads a moment after the page opens: collapse once it arrives, unless the user already toggled.
  const touched = useRef(false);
  useEffect(() => {
    if (favourite && !touched.current) setPickerOpen(false);
  }, [favourite]);

  async function pick(grape: string) {
    if (saving) return;
    setSaving(grape);
    const err = await saveFavourite(grape);
    setError(err);
    setSaving(null);
    if (!err) setPickerOpen(false);
  }

  return (
    <>
      <details
        className="card collapsible"
        open={!favourite || pickerOpen}
        onToggle={(e) => {
          const open = (e.currentTarget as HTMLDetailsElement).open;
          if (open !== pickerOpen) touched.current = true;
          setPickerOpen(open);
        }}
      >
        <summary
          onClick={(e) => {
            // Nothing picked yet: keep the choices visible.
            if (!favourite) e.preventDefault();
          }}
        >
          <span>{t("mine.favTitle")}</span>
          <span className={`fav-choice ${favourite ? "" : "none"}`}>{favourite ?? t("mine.pickOne")}</span>
        </summary>
        <p className="muted small">
          {guest
            ? t("mine.favGuest")
            : t("mine.favSaved")}
        </p>
        <div className="grape-grid">
          {GRAPES.map(({ name }) => (
            <button
              key={name}
              className={`grape ${favourite === name ? "selected" : ""}`}
              onClick={() => pick(name)}
              disabled={saving !== null}
              aria-pressed={favourite === name}
            >
              {saving === name ? t("mine.saving") : name}
            </button>
          ))}
        </div>
        {error && <p className="notice" role="alert">{t(error as TextKey)}</p>}
      </details>

      <SecretMessage secret={props.secret} missing={props.secretMissing} save={props.saveSecret} guest={guest} />

      {findGrape(favourite) && <GrapeCard grape={findGrape(favourite)!} />}
    </>
  );
}
