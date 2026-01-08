import ProductsLayoutShell from "@/components/shared/ProductsLayoutShell";

export default function CreateOrderLayout({ children }) {
  return (
    <ProductsLayoutShell basePath="/createOrder">
      {children}
    </ProductsLayoutShell>
  );
}
