import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// The anon key is public by design: row-level security in the database protects the data.
export const supabase: SupabaseClient | null =
  url && anonKey
    ? createClient(url, anonKey, { auth: { persistSession: true, autoRefreshToken: true } })
    : null;

export const GRAPES = [
  "Niagara",
  "Concord",
  "Catawba",
  "Delaware",
  "Cotton Candy",
  "Thompson Seedless",
  "Red Globe",
  "Muscat",
  "Chardonnay",
  "Riesling",
  "Pinot Noir",
  "Cabernet Sauvignon",
];
