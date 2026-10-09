import { createClient, SupabaseClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

function getEnvValue(key: string): string {
  if (process.env[key]) return process.env[key]!;

  // Fallback to read from .env.local dynamically if process started before file was created
  try {
    const envPath = path.join(process.cwd(), ".env.local");
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf-8");
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (trimmed.startsWith(`${key}=`)) {
          return trimmed.substring(key.length + 1).trim();
        }
      }
    }
  } catch (e) {
    // ignore
  }

  return "";
}

const supabaseUrl = getEnvValue("NEXT_PUBLIC_SUPABASE_URL") || "https://wltoldskffnbxropaspz.supabase.co";
const supabaseAnonKey = getEnvValue("NEXT_PUBLIC_SUPABASE_ANON_KEY");

export const isSupabaseConfigured = () => {
  const key = getEnvValue("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  return Boolean(supabaseUrl && key && key.trim().length > 20);
};

// Singleton Supabase client
let supabaseInstance: SupabaseClient | null = null;

export const getSupabaseClient = () => {
  const key = getEnvValue("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  if (!supabaseInstance && isSupabaseConfigured()) {
    supabaseInstance = createClient(supabaseUrl, key, {
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });
  }
  return supabaseInstance;
};

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, getEnvValue("NEXT_PUBLIC_SUPABASE_ANON_KEY"))
  : null;
