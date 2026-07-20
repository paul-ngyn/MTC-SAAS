// src/lib/supabase/admin.ts
// Service-role Supabase client — bypasses RLS. Server-only.
// NEVER import this from a Client Component or the browser bundle;
// only use it from route handlers that verify the request themselves
// (e.g. Stripe webhooks, whose signature check is the auth boundary).
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }

  return createSupabaseClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
