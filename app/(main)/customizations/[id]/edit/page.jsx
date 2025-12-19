import CustomizationForm from "@/components/CustomizationForm";
import { updateCustomizationAction } from "@/actions/updateCustomizationAction";
import { getCustomizationById } from "@/lib/customizations";

export default async function EditCustomizationPage(props) {
  const { id } = await props.params;
  const customizationId = Number(id);

  const customization = await getCustomizationById(customizationId);

  if (!customization) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-8 pt-20">
        Tilpasning ikke fundet
      </main>
    );
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


