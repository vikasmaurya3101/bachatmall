import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      {/* offset for fixed sidebar (desktop) and fixed top header */}
      <div className="lg:pl-56 pt-14">
        {children}
      </div>
    </div>
  );
}
