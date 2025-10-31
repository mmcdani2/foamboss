// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

// Environment variables (from .env at project root)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

// Optional: throw errors early if missing
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables. Check your .env file.")
}

// Create and export client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
