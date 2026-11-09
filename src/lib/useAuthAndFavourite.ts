import { useCallback, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "./supabase";

export function useAuthAndFavourite() {
  const [user, setUser] = useState<User | null>(null);
  const [favourite, setFavourite] = useState<string | null>(null);
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

  const loadFavourite = useCallback(async () => {
    if (!supabase || !user) return setFavourite(null);
    const { data, error } = await supabase.from("favourites").select("grape").eq("user_id", user.id).maybeSingle();
    if (!error) setFavourite(data?.grape ?? null);
  }, [user]);

  // Sync: load on login, refresh when the app comes back to the foreground, and listen live.
  useEffect(() => {
    if (!supabase || !user) {
      setFavourite(null);
      return;
    }
    const client = supabase;
    loadFavourite();

    const onVisible = () => document.visibilityState === "visible" && loadFavourite();
    document.addEventListener("visibilitychange", onVisible);

    const channel = client
      .channel(`favourites:${user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "favourites", filter: `user_id=eq.${user.id}` },
        (payload) => {
          const row = payload.new as { grape?: string } | null;
          setFavourite(row?.grape ?? null);
        },
      )
      .subscribe();

    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      client.removeChannel(channel);
    };
  }, [user, loadFavourite]);

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

  return { user, favourite, ready, saveFavourite };
}
