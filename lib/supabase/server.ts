import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseServerEnv } from "@/lib/config/env";

let cachedClient: SupabaseClient | null = null;

export function getSupabaseServiceClient() {
  if (cachedClient) {
    return cachedClient;
  }

  const { supabaseUrl, serviceRoleKey } = getSupabaseServerEnv();

  cachedClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return cachedClient;
}
