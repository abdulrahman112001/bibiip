import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import AdminHeaderClient from "@/components/admin/AdminHeaderClient";

const HEADER_HEIGHT = 72;

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/admin/login");

  async function logoutAction() {
    "use server";
    await signOut({ redirectTo: "/admin/login" });
  }

  return (
    <div className="min-h-screen bg-bg">
      <header
        className="fixed inset-x-0 top-0 z-20 border-b border-border bg-white"
        style={{ height: HEADER_HEIGHT }}
      >
        <AdminHeaderClient email={session.user?.email} onLogout={logoutAction} />
      </header>

      {/* الهيدر fixed فبياخد نفسه بره الـ flow - محتاجين مسافة فاضية بارتفاعه فوق الباقي */}
      <div style={{ paddingTop: HEADER_HEIGHT }}>
        <Sidebar topOffset={HEADER_HEIGHT} />
        <main className="min-w-0 ms-64 px-6 py-10 md:px-10">{children}</main>
      </div>
    </div>
  );
}
