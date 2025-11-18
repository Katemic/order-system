"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function ProductsLayoutShell({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category") || "Brød";

  return (
    <div className="min-h-screen flex bg-neutral-50">
      <aside className="hidden md:flex fixed top-16 left-0 w-64 h-[calc(100vh-64px)] border-r border-neutral-200 bg-white z-40">
        <Sidebar selectedCategory={selectedCategory} />
      </aside>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="w-64 bg-white border-r border-neutral-200 shadow-xl h-full overflow-y-auto">
            <Sidebar
              selectedCategory={selectedCategory}
              onItemClick={() => setIsMobileMenuOpen(false)}
            />
          </div>

          <button
            type="button"
            className="flex-1 bg-black/40"
            aria-label="Luk menu"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 md:ml-64">

        <div className="md:hidden px-4 py-2 border-b border-neutral-200 bg-white sticky top-16 z-40">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className="inline-flex items-center gap-2 rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-5 h-5"
              stroke="currentColor"
              strokeWidth="1.8"
              fill="none">
              <line x1="4" y1="6" x2="20" y2="6" strokeLinecap="round" />
              <line x1="4" y1="12" x2="20" y2="12" strokeLinecap="round" />
              <line x1="4" y1="18" x2="20" y2="18" strokeLinecap="round" />
            </svg>
            <span>Menu</span>
          </button>
        </div>

        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
