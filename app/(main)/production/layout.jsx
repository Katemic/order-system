"use client";

import { useState } from "react";
import ProductionFilterSidebar from "@/components/production/ProductionFilterSidebar";

export default function ProductionLayout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex ">
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex fixed top-16 left-0 w-64 h-[calc(100vh-64px)]
                        border-r border-neutral-200 bg-white z-40">
        <ProductionFilterSidebar />
      </aside>

      {/* MOBILE SIDEBAR */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="w-64 bg-white border-r border-neutral-200 shadow-xl h-full">
            <ProductionFilterSidebar onItemClick={() => setIsMobileMenuOpen(false)} />
          </div>

          <button
            className="flex-1 bg-black/40"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Luk menu"
          />
        </div>
      )}

      {/* CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-64">
        <div className="md:hidden px-4 py-2 border-b border-neutral-200 bg-white sticky top-16 z-40">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="inline-flex items-center gap-2 rounded-md border border-neutral-300 px-3 py-2 text-sm"
          >
            ☰ Menu
          </button>
        </div>

        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
