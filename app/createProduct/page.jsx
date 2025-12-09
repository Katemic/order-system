// app/products/create/page.jsx
import ProductForm from "@/components/ProductForm";
import { createProductAction } from "@/actions/createProductAction";
import { getCustomizationTypesWithOptions } from "@/lib/customizations";

export default async function CreateProductPage() {
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



