const warnMissing = (key: string) => {
  if (typeof console !== "undefined") {
    console.warn(`[env] Missing required environment variable: ${key}`);
  }
};

const readEnv = (
  key: keyof ImportMetaEnv,
  required = true
): string => {
  const raw = import.meta.env[key];
  const value = typeof raw === "string" ? raw.trim() : "";
  if (value.length > 0) {
    return value;
  }
  if (required) {
    warnMissing(key);
  }
  return "";
};

export const SUPABASE_URL = readEnv("VITE_SUPABASE_URL");
export const SUPABASE_ANON_KEY = readEnv("VITE_SUPABASE_ANON_KEY");

export const hasSupabaseConfig = () =>
  SUPABASE_URL.length > 0 && SUPABASE_ANON_KEY.length > 0;
