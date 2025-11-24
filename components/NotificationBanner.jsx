"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export default function NotificationBanner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const deleted = searchParams.get("deleted");
  const productName = searchParams.get("name") || "";

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (deleted === "true") {
      setVisible(true);

      const timer = setTimeout(() => {
        setVisible(false);

        // Kopiér nuværende query params
        const params = new URLSearchParams(searchParams.toString());

        // Fjern kun dem, der hører til notifikationen
        params.delete("deleted");
        params.delete("name");

        const newQuery = params.toString();
        const url = newQuery ? `${pathname}?${newQuery}` : pathname;

        router.replace(url, { scroll: false });
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [deleted, router, pathname, searchParams]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 bg-red-600 text-white px-4 py-3 rounded-lg shadow-lg z-50">
      Produkt "{productName}" er slettet.
    </div>
  );
}

