import ProductsLayoutShell from "@/components/shared/ProductsLayoutShell";
import { getProfile } from "@/lib/authorization";

export default async function ProductsLayout({ children }) {

  const {profile} = await getProfile();
  return <ProductsLayoutShell isAdmin={profile?.admin}>{children}</ProductsLayoutShell>;
}
