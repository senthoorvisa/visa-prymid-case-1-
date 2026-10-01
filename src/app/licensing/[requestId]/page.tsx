import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { demoRequests } from "@/lib/showcase-data";

export default async function LicensingRequestRoute({ params }: { params: Promise<{ requestId: string }> }) {
  const { requestId } = await params;
  if (!demoRequests.some((request) => request.id === requestId)) notFound();
  return <AppShell section="licensing" requestId={requestId} />;
}
