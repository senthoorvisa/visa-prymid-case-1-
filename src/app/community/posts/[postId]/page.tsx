import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { demoCommunityPosts } from "@/lib/showcase-data";

export default async function CommunityPostRoute({ params }: { params: Promise<{ postId: string }> }) {
  const { postId } = await params;
  if (!demoCommunityPosts.some((post) => post.id === postId) && !/^post-demo-\d+$/.test(postId)) notFound();
  return <AppShell section="community" postId={postId} />;
}
