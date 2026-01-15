import ProductForm from "@/components/product/ProductForm";
import { createProductAction } from "@/actions/product/createProductAction";
import { getCustomizationTypesWithOptions } from "@/lib/customizations";
import { getProfile } from "@/lib/authorization";
import { redirect } from "next/navigation";

export default async function CreateProductPage() {

  const { profile } = await getProfile();

  if (!profile?.admin) redirect("/forbidden");

  const customizationData = await getCustomizationTypesWithOptions();

  return (
    <ProductForm
      mode="create"
      action={createProductAction}
      customizationData={customizationData}
      selectedCustomizationOptionIds={[]} //empty on create
    />
  );
}



