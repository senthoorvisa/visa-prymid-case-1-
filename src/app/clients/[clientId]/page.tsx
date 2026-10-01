import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { demoClients } from "@/lib/showcase-data";

export default async function ClientProfileRoute({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;
  if (!demoClients.some((client) => client.id === clientId) && !/^demo-\d+$/.test(clientId)) notFound();
  return <AppShell section="clients" clientId={clientId} />;
}
