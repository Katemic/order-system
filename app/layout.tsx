import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import Topbar from "@/components/Topbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Byens Bager",
  description: "Bestillingssystem",
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="da">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Topbar />
        {children}
      </body>
    </html>
  );
}
