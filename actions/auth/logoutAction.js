"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/auth/server";

// Server action to log out the current user by signing them out
// and redirecting them to the login page.
export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
