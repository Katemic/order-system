"use client";

import { usePathname } from "next/navigation";
import ProductsLayoutShell from "@/components/ProductsLayoutShell";

export default function EditProductsLayout({ children }) {
  const pathname = usePathname();

  // basePath skal ikke inkludere query params
  const basePath = pathname;

  return (
    <ProductsLayoutShell basePath={basePath}>
      {children}
    </ProductsLayoutShell>
  );
}


