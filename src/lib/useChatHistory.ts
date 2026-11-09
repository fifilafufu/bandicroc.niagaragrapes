import { useEffect, useRef } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "./supabase";
import { GREETING, type Msg } from "../components/Chat";

const KEEP = 40; // messages kept in the cloud (older ones drop off)

// What gets stored: finished messages only, without the greeting or in-progress flags.
const toStored = (chat: Msg[]) =>
  chat
    .filter((m) => m !== GREETING && !m.pending)
    .slice(-KEEP)
    .map(({ role, content, sources, photos }) => ({ role, content, sources, photos }));

const fromStored = (rows: unknown): Msg[] => {
  const list = Array.isArray(rows) ? (rows as Msg[]) : [];
  const clean = list.filter((m) => (m?.role === "user" || m?.role === "assistant") && typeof m.content === "string");
  return [GREETING, ...clean];
};

// Logged-in users' Grape Bot chats are saved to their account and synced live to their other devices.
// Logged out (or before the SQL is run), the chat just lives on this device, as before.
export function useChatHistory(user: User | null, chat: Msg[], setChat: (m: Msg[]) => void) {
  const lastSynced = useRef<string>(""); // JSON of the last version saved or received, to avoid echo loops
  const loaded = useRef(false);
  const available = useRef(true);

  // Load on login, and listen for changes from the user's other devices.
  useEffect(() => {
    loaded.current = false;
    if (!supabase || !user) return;
    const client = supabase;
    let cancelled = false;

    client
      .from("chat_history")
      .select("messages")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          available.current = false; // table not set up yet: keep chats on this device only
          return;
        }
        available.current = true;
        const stored = data?.messages ?? [];
        if (Array.isArray(stored) && stored.length) {
          lastSynced.current = JSON.stringify(stored);
          setChat(fromStored(stored));
        }
        loaded.current = true;
      });

    const channel = client
      .channel(`chat:${user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "chat_history", filter: `user_id=eq.${user.id}` },
        (payload) => {
          const stored = (payload.new as { messages?: unknown } | null)?.messages ?? [];
          const json = JSON.stringify(stored);
          if (json === lastSynced.current) return; // our own save coming back
          lastSynced.current = json;
          setChat(fromStored(stored));
        },
      )
      .subscribe();

    return () => {
      cancelled = true;
      client.removeChannel(channel);
    };
  }, [user, setChat]);

  // Save after each finished answer (or a clear), shortly after things settle.
  useEffect(() => {
    if (!supabase || !user || !loaded.current || !available.current) return;
    if (chat.some((m) => m.pending)) return;
    const stored = toStored(chat);
    const json = JSON.stringify(stored);
    if (json === lastSynced.current) return;
    const client = supabase;
    const t = setTimeout(() => {
      lastSynced.current = json;
      client
        .from("chat_history")
        .upsert({ user_id: user.id, messages: stored, updated_at: new Date().toISOString() })
        .then(({ error }) => error && console.warn("Chat sync failed:", error.message));
    }, 600);
    return () => clearTimeout(t);
  }, [chat, user]);
}
