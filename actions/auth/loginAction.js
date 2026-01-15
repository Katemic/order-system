"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/auth/server";
import { supabaseAdmin } from "@/lib/auth/adminClient";
import { getUserIdByUsername } from "@/lib/authorization";

// Server action to log in a user with email and password
// and redirect to the home page on success.
export async function loginAction(formData) {
  const userName = String(formData.get("userName") || "");
  const password = String(formData.get("password") || "");

  console.log("Logging in user:", userName);

  // Create Supabase server client using the request's cookies
  const supabase = await createClient();

  // Fetch user by userName to get their email
   const userId = await getUserIdByUsername(userName);
  if (!userId) {
    throw new Error("Ugyldigt brugernavn eller password");
  }

  // Use admin client to get user details by ID
  const { data: userData } = await supabaseAdmin.auth.admin.getUserById(
    userId
  );
  console.log("Fetched user data:", userData);

  const email = userData.user.email;

  // Sign in with email and password
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);

  redirect("/");
}
