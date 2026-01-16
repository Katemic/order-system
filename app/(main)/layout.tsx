import Topbar from "@/components/layout/Topbar";
import { getProfile } from "@/lib/authorization";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const { profile } = await getProfile();

  return (
    <>
      <Topbar isAdmin={profile?.admin} />
      {children}
    </>
  );
}
