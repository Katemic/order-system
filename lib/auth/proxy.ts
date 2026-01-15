import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

//Function to update the session based on the request cookies
//Used in middleware to protect routes and manage redirects
//Eg. if user is not logged in and tries to access a protected route, redirect to login
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  // Create Supabase server client with request cookies
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));

        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub ?? null;

  return { response, userId };
}
