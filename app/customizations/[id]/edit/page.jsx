import CustomizationForm from "@/components/CustomizationForm";
import { updateCustomizationAction } from "@/actions/updateCustomizationAction";

export default function CreateCustomizationPage() {
  return( 
  <main>
    <CustomizationForm
        mode="edit"
        action={updateCustomizationAction}
    />
  </main>
  );
}
