import { createBrowserClient } from "@supabase/ssr";

//Create a Supabase client for browser usage, 
// e.g. in client components and hooks to check auth state(admin/user)
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
