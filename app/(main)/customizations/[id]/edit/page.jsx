import CustomizationForm from "@/components/customization/CustomizationForm";
import { updateCustomizationAction } from "@/actions/customization/updateCustomizationAction";
import { getCustomizationById } from "@/lib/customizations";
import { notFound } from "next/navigation";
import { getProfile } from "@/lib/authorization";
import { redirect } from "next/navigation";

export default async function EditCustomizationPage(props) {
  const { id } = await props.params;
  const customizationId = Number(id);

  const { profile } = await getProfile();
  const isAdmin = profile?.admin;

  if (!isAdmin) redirect("/forbidden");

  const customization = await getCustomizationById(customizationId);

  if (!customization) {
    return notFound();
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8 pt-20">
      <CustomizationForm
        mode="edit"
        initialTitle={customization.name}
        initialOptions={customization.options.map((o) => o.name)}
        action={updateCustomizationAction.bind(null, customizationId)}
      />
    </main>
  );
}


