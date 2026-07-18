import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";
import GuidesManager from "@/components/admin/GuidesManager";

export const metadata: Metadata = {
  title: "Guides — Admin",
  robots: { index: false, follow: false },
};

export default function AdminGuidesPage() {
  return (
    <AdminShell>
      <GuidesManager />
    </AdminShell>
  );
}
