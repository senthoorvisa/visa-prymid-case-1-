import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { makeDemoWorkspace } from "@/lib/showcase-data";

export default async function SongVersionRoute({ params }: { params: Promise<{ songId: string }> }) {
  const { songId } = await params;
  if (!makeDemoWorkspace().songs.some((song) => song.id === songId)) notFound();
  return <AppShell section="catalogue" songId={songId} />;
}
