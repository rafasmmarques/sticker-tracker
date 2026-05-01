import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as
  | string
  | undefined;

function getRequiredEnv(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(`${name} is missing.`);
  }

  return value;
}

function validateSupabaseUrl(url: string): string {
  try {
    const parsedUrl = new URL(url);

    if (!parsedUrl.hostname.endsWith(".supabase.co")) {
      throw new Error();
    }

    return url;
  } catch {
    throw new Error("VITE_SUPABASE_URL must be a valid Supabase project URL.");
  }
}

export const supabase = createClient(
  validateSupabaseUrl(getRequiredEnv(supabaseUrl, "VITE_SUPABASE_URL")),
  getRequiredEnv(supabaseAnonKey, "VITE_SUPABASE_ANON_KEY")
);
