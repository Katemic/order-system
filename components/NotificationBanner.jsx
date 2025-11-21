"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function NotificationBanner() {
  const params = useSearchParams();
  const router = useRouter();

  const deleted = params.get("deleted");
  const productName = params.get("name") || "";

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (deleted === "true") {
      setVisible(true);

      // Fjern notifikationen efter 5s
      const timer = setTimeout(() => {
        setVisible(false);
        router.replace("/products", { scroll: false });
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [deleted, router]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 bg-red-600 text-white px-4 py-3 rounded-lg shadow-lg z-50">
      Produkt "{productName}" er slettet.
    </div>
  );
}
