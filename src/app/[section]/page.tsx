import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { sections } from "@/lib/format";

export default async function SectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  if (!sections.includes(section as (typeof sections)[number])) notFound();
  return <AppShell section={section as (typeof sections)[number]} />;
}
