import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

//Create a Supabase client for server usage,
// e.g. in server actions and server components to handle auth server-side. 
//Used for loginAction, logoutAction, to make admin checks server-side, etc.
export async function createClient() {
  // Get cookies for the current request
  const cookieStore = await cookies();

  // Supabase URL + anon key from env vars
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) throw new Error("Missing Supabase env vars");

  // Create and return the Supabase server client with authenticated cookies
  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options);
        });
      },
    },
  });
}
