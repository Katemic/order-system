import ProductForm from "@/components/product/ProductForm";
import { updateProductAction } from "@/actions/product/updateProductAction";
import { getProductById } from "@/lib/products";
import {
  getCustomizationTypesWithOptions,
  getProductCustomizationOptionIds,
} from "@/lib/customizations";
import { notFound } from "next/navigation";
import { getProfile } from "@/lib/authorization";
import { redirect } from "next/navigation";

export default async function EditProductPage(props) {
  const { profile } = await getProfile();
  const isAdmin = profile?.admin;

  if (!isAdmin) redirect("/forbidden");

  const { id } = await props.params;
  const productId = Number(id);

  const [product, customizationData, selectedCustomizationOptionIds] =
    await Promise.all([
      getProductById(productId),
      getCustomizationTypesWithOptions(),
      getProductCustomizationOptionIds(productId),
    ]);

  if (!product) {
    return notFound();
  }

  return (
    <ProductForm
      mode="edit"
      product={product}
      action={updateProductAction}
      customizationData={customizationData}
      selectedCustomizationOptionIds={selectedCustomizationOptionIds}
    />
  );
}
