import CustomizationForm from "@/components/CustomizationForm";
import { createCustomizationAction } from "@/actions/createCustomizationAction";

export default function CreateCustomizationPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-8 pt-20">

      <CustomizationForm
        mode="create"
        action={createCustomizationAction}
      />
    </main>
  );
}
