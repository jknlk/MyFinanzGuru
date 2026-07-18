import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";
import GuideEditor from "@/components/admin/GuideEditor";

export const metadata: Metadata = {
  title: "Edit Guide — Admin",
  robots: { index: false, follow: false },
};

export default async function AdminGuideEditPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <AdminShell>
      <GuideEditor slug={slug} />
    </AdminShell>
  );
}
