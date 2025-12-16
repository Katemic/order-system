"use client";

import { useEffect } from "react";

export default function PrintAuto() {
  useEffect(() => {
    const t = setTimeout(() => window.print(), 150);
    return () => clearTimeout(t);
  }, []);

  return (
    <style jsx global>{`
      @media print {
        .print-page {
          page-break-after: always;
          break-after: page;
        }
        .print-page:last-child {
          page-break-after: auto;
          break-after: auto;
        }
      }
    `}</style>
  );
}
