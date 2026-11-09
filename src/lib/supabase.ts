import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// The URL and publishable (anon) key are public by design: row-level security in the
// database protects the data. Env vars override these defaults if set.
const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined) || "https://tzfxnvgdhysjntkyzawd.supabase.co";
const anonKey =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) || "sb_publishable_U31CZV0ikXDNyIGRZLx5UQ_q4Qj-QMU";

export const supabase: SupabaseClient | null =
  url && anonKey
    ? createClient(url, anonKey, { auth: { persistSession: true, autoRefreshToken: true } })
    : null;

