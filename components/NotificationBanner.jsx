"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export default function NotificationBanner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const created = searchParams.get("created");
  const deleted = searchParams.get("deleted");
  const updated = searchParams.get("updated");
  const productName = searchParams.get("name") || "";

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const isOrderCreated = created === "true";
    const isDeletion = deleted === "true";
    const isOrderUpdated = updated === "true";

    if (!isOrderCreated && !isDeletion && !isOrderUpdated) return;

    setVisible(true);

    if (isOrderCreated) {
      try {
        localStorage.removeItem("orderItems");
      } catch (err) {
        console.error("Kunne ikke fjerne orderItems:", err);
      }
    }

    const timer = setTimeout(() => {
      setVisible(false);

      const params = new URLSearchParams(searchParams.toString());
      params.delete("created");
      params.delete("deleted");
      params.delete("updated");
      params.delete("name");

      const newQuery = params.toString();
      const url = newQuery ? `${pathname}?${newQuery}` : pathname;

      router.replace(url, { scroll: false });
    }, 5000);

    return () => clearTimeout(timer);
  }, [created, deleted, updated, router, pathname, searchParams]);

  if (!visible) return null;

  let text = "";
  let bgColor = "bg-emerald-600";

  if (deleted === "true") {
    text = `Produkt "${productName}" er slettet.`;
    bgColor = "bg-red-600";
  } else if (updated === "true") {
    text = "Bestilling er opdateret.";
    bgColor = "bg-emerald-600";
  } else if (created === "true") {
    text = "Bestilling er oprettet.";
    bgColor = "bg-emerald-600";
  }

  return (
    <div
      className={`fixed bottom-6 right-6 ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg z-50`}
    >
      {text}
    </div>
  );
}
