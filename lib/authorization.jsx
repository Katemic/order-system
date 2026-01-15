import { createClient } from "@/lib/auth/server";

// Function to get user ID by username from the profiles table
export async function getUserIdByUsername(username) {
  const supabase = await createClient();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username)
    .single();

  if (error || !profile?.id) {
    return null;
  }

  return profile.id;
}

// Function to get the current user's profile and auth info 
export async function getProfile() {
  const supabase = await createClient();

  const { data: auth } = await supabase.auth.getUser();
  const user = auth?.user;

  if (!user) return { user: null, profile: null };

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, username, admin")
    .eq("id", user.id)
    .single();

  if (error) return { user, profile: null };

  return { user, profile };
}
