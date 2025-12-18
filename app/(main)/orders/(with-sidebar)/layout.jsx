"use client";

import { useState } from "react";
import OrderFilterSidebar from "@/components/OrderFilterSidebar";

export default function OrdersLayout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
      <div className="min-h-screen flex">
        
        {/* ---------------- DESKTOP SIDEBAR ---------------- */}
        <aside className="hidden md:flex fixed top-16 left-0 w-64 h-[calc(100vh-64px)]
                          border-r border-neutral-200 bg-white z-40">
          <OrderFilterSidebar />
        </aside>

        {/* ---------------- MOBILE SIDEBAR OVERLAY ---------------- */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">

            {/* Drawer */}
            <div className="w-64 bg-white border-r border-neutral-200 shadow-xl 
                            h-full overflow-y-auto">
              <OrderFilterSidebar onItemClick={() => setIsMobileMenuOpen(false)} />
            </div>

            {/* Backdrop */}
            <button
              type="button"
              className="flex-1 bg-black/40"
              aria-label="Luk menu"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          </div>
        )}

        {/* ---------------- MAIN CONTENT AREA ---------------- */}
        <div className="flex-1 flex flex-col min-w-0 md:ml-64">

          {/* ------ MOBILE TOP BAR (BURGER BUTTON) ------ */}
          <div className="md:hidden px-4 py-2 border-b border-neutral-200 
                          bg-white sticky top-16 z-40">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="inline-flex items-center gap-2 rounded-md border 
                         border-neutral-300 px-3 py-2 text-sm text-neutral-700 
                         hover:bg-neutral-100"
            >

              {/* Burger Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-5 h-5"
                stroke="currentColor"
                strokeWidth="1.8"
                fill="none"
              >
                <line x1="4" y1="6" x2="20" y2="6" strokeLinecap="round" />
                <line x1="4" y1="12" x2="20" y2="12" strokeLinecap="round" />
                <line x1="4" y1="18" x2="20" y2="18" strokeLinecap="round" />
              </svg>

              <span>Menu</span>
            </button>
          </div>

          {/* PAGE CONTENT */}
          <div className="flex-1">{children}</div>
        </div>
      </div>
  );
}


