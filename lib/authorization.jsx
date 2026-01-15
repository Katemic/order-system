import { createClient } from "@/lib/auth/server";

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