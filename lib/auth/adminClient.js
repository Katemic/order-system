import { createClient } from "@supabase/supabase-js";

// Supabase Admin client using service role key for elevated privileges (e.g., managing users).
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
