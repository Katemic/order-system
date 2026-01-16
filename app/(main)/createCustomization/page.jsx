import CustomizationForm from "@/components/customization/CustomizationForm";
import { createCustomizationAction } from "@/actions/customization/createCustomizationAction";
import { getProfile } from "@/lib/authorization";
import { redirect } from "next/navigation";

export default async function CreateCustomizationPage() {
  const { profile } = await getProfile();
  const isAdmin = profile?.admin;

  if (!isAdmin) redirect("/forbidden");

  return (
    <main className="max-w-3xl mx-auto px-4 py-8 pt-20">
      <CustomizationForm mode="create" action={createCustomizationAction} />
    </main>
  );
}
