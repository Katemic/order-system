"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/auth/server";
import { supabaseAdmin } from "@/lib/auth/adminClient";
import { getUserIdByUsername } from "@/lib/authorization";

// Server action to log in a user with email and password
// and redirect to the home page on success.
export async function loginAction(prevState, formData) {
  const userName = String(formData.get("userName") || "").trim();
  const password = String(formData.get("password") || "");

  const baseState = (overrides = {}) => ({
    success: false,
    error: null,
    fieldErrors: {},
    values: { userName },
    ...overrides,
  });

  const invalidCredentials = () =>
    baseState({ error: "Ugyldigt brugernavn eller password" });

  // Field validation
  const fieldErrors = {};
  if (!userName) fieldErrors.userName = "Brugernavn er påkrævet.";
  if (!password) fieldErrors.password = "Password er påkrævet.";

  if (Object.keys(fieldErrors).length > 0) {
    return baseState({ fieldErrors });
  }

  try {
    // Create Supabase server client using the request's cookies
    const supabase = await createClient();

    // Fetch user by userName to get their email
    const userId = await getUserIdByUsername(userName);
    if (!userId) return invalidCredentials();

    // Use admin client to get user details by ID
    const { data: userData, error: adminError } =
      await supabaseAdmin.auth.admin.getUserById(userId);

    const email = userData?.user?.email;
    if (adminError || !email) return invalidCredentials();

    // Sign in with email and password
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return invalidCredentials();
  } catch {
    return baseState({ error: "Noget gik galt. Prøv igen." });
  }

  redirect("/");
}
