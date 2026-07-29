import AdminTopNav from "@/components/admin/AdminTopNav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminTopNav />
      {children}
    </>
  );
}
