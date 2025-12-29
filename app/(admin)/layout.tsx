import { AdminSidebar, AdminMobileHeader } from "@/components/admin/sidebar";
import { Toaster } from "@/components/ui/sonner";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Desktop Sidebar */}
      <AdminSidebar />

      {/* Mobile Header */}
      <AdminMobileHeader />

      {/* Main Content */}
      <main className="lg:pl-64">
        <div className="container mx-auto p-4 lg:p-6">{children}</div>
      </main>

      <Toaster position="top-center" richColors />
    </div>
  );
}

