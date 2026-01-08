import Topbar from "@/components/layout/Topbar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Topbar />
      {children}
    </>
  );
}