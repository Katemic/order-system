"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export default function NotificationBanner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const created = searchParams.get("created") === "true";
  const updated = searchParams.get("updated") === "true";
  const deleted = searchParams.get("deleted") === "true";
  const id = searchParams.get("id");

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!created && !updated && !deleted) return;

    setVisible(true);

    const timer = setTimeout(() => {
      setVisible(false);

      const params = new URLSearchParams(searchParams.toString());
      params.delete("created");
      params.delete("updated");
      params.delete("deleted");
      params.delete("id");

      const newQuery = params.toString();
      const url = newQuery ? `${pathname}?${newQuery}` : pathname;

      router.replace(url, { scroll: false });
    }, 4000);

    return () => clearTimeout(timer);
  }, [created, updated, deleted, searchParams, router, pathname]);

  if (!visible) return null;

  const isOrders = pathname.startsWith("/orders");
  const isProducts = pathname.startsWith("/products");
  const isCustomizations = pathname.startsWith("/customizations");

  let text = "";

  if (deleted) {
    if (isOrders && id) text = `Bestilling #${id} er slettet.`;
    else if (isProducts) text = "Produkt er slettet.";
    else if (isCustomizations) text = "Tilpasning er slettet.";
    else text = "Element er slettet.";
  } 
  else if (created) {
    if (isOrders) text = "Bestilling er oprettet.";
    else if (isProducts) text = "Produkt er oprettet.";
    else if (isCustomizations) text = "Tilpasning er oprettet.";
    else text = "Oprettet.";
  } 
  else if (updated) {
    if (isOrders) text = "Bestilling er opdateret.";
    else if (isProducts) text = "Produkt er opdateret.";
    else if (isCustomizations) text = "Tilpasning er opdateret.";
    else text = "Opdateret.";
  }

  const bgColor = deleted ? "bg-red-600" : "bg-emerald-600";

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg`}
      role="status"
      aria-live="polite"
    >
      {text}
    </div>
  );
}
