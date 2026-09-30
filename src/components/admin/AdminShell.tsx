"use client";

import { useState } from "react";
import Sidebar from "@/components/admin/Sidebar";
import AdminHeaderClient from "@/components/admin/AdminHeaderClient";

export default function AdminShell({
  email,
  onLogout,
  children,
}: {
  email?: string | null;
  onLogout: () => Promise<void>;
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bg">
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
        />
      )}

      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((v) => !v)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <main className="mx-3 mt-3 flex-1 space-y-4 overflow-y-auto rounded-t-3xl bg-bg-elev p-3 scrollbar-thin md:mx-5 md:mt-5 md:p-6">
          <AdminHeaderClient
            email={email}
            onLogout={onLogout}
            onMenuToggle={() => setMobileOpen(true)}
          />
          {children}
        </main>
      </div>
    </div>
  );
}
