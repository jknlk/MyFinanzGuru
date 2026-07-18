import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";
import SeminarsManager from "@/components/admin/SeminarsManager";

export const metadata: Metadata = {
  title: "Seminars — Admin",
  robots: { index: false, follow: false },
};

export default function AdminSeminarsPage() {
  return (
    <AdminShell>
      <SeminarsManager />
    </AdminShell>
  );
}
