import { useCallback, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "./supabase";

export type Secret = { message: string; updatedAt: string | null };

export function useAuthAndFavourite() {
  const [user, setUser] = useState<User | null>(null);
  const [favourite, setFavourite] = useState<string | null>(null);
  const [secret, setSecret] = useState<Secret | null>(null);
  const [secretMissing, setSecretMissing] = useState(false); // the secret_messages table isn't set up yet
  const [ready, setReady] = useState(!supabase);

  // Session: restored from storage on each device, kept fresh automatically.
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setReady(true);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
    return () => data.subscription.unsubscribe();
  }, []);

  const loadAll = useCallback(async () => {
    if (!supabase || !user) return;
    const [fav, sec] = await Promise.all([
      supabase.from("favourites").select("grape").eq("user_id", user.id).maybeSingle(),
      supabase.from("secret_messages").select("message, updated_at").eq("user_id", user.id).maybeSingle(),
    ]);
    if (!fav.error) setFavourite(fav.data?.grape ?? null);
    if (sec.error) {
      // 42P01 / PGRST205: table doesn't exist yet (supabase/secret_messages.sql not run).
      setSecretMissing(sec.error.code === "42P01" || sec.error.code === "PGRST205");
    } else {
      setSecretMissing(false);
      setSecret({ message: sec.data?.message ?? "", updatedAt: sec.data?.updated_at ?? null });
    }
  }, [user]);

  // Sync: load on login, refresh when the app comes back to the foreground, and listen live.
  useEffect(() => {
    if (!supabase || !user) {
      setFavourite(null);
      setSecret(null);
      return;
    }
    const client = supabase;
    loadAll();

    const onVisible = () => document.visibilityState === "visible" && loadAll();
    document.addEventListener("visibilitychange", onVisible);

    const channel = client
      .channel(`user-data:${user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "favourites", filter: `user_id=eq.${user.id}` },
        (payload) => setFavourite((payload.new as { grape?: string } | null)?.grape ?? null),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "secret_messages", filter: `user_id=eq.${user.id}` },
        (payload) => {
          const row = payload.new as { message?: string; updated_at?: string } | null;
          setSecret({ message: row?.message ?? "", updatedAt: row?.updated_at ?? null });
        },
      )
      .subscribe();

    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      client.removeChannel(channel);
    };
  }, [user, loadAll]);

  const saveFavourite = useCallback(
    async (grape: string) => {
      if (!supabase || !user) return "Log in first.";
      const { error } = await supabase
        .from("favourites")
        .upsert({ user_id: user.id, grape, updated_at: new Date().toISOString() });
      if (error) return error.message;
      setFavourite(grape);
      return null;
    },
    [user],
  );

  const saveSecret = useCallback(
    async (message: string) => {
      if (!supabase || !user) return "Log in first.";
      const updatedAt = new Date().toISOString();
      const { error } = await supabase
        .from("secret_messages")
        .upsert({ user_id: user.id, message: message.slice(0, 1000), updated_at: updatedAt });
      if (error) return error.message;
      setSecret({ message, updatedAt });
      return null;
    },
    [user],
  );

  return { user, favourite, ready, saveFavourite, secret, secretMissing, saveSecret };
}
