"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, CalendarDays, Heart, MessageCircle, Plus, Send, UsersRound, X } from "lucide-react";
import { demoCommunityMembers, demoEvents } from "@/lib/showcase-data";
import { useShowcase } from "@/components/showcase-provider";
import { DemoDataNotice, InitialAvatar, MetricTiles, PanelTitle, ToneTag } from "@/components/showcase-ui";

type CommunityCategory = "All activity" | "Rights practice" | "Catalogue tips" | "Ask the community" | "Announcements" | "Events";

const sampleReplies: Record<string, { author: string; initials: string; time: string; body: string }[]> = {
  "post-regional-rights": [
    { author: "Meena Sundaram", initials: "MS", time: "12 min ago", body: "We keep broadcast and catch-up together when the grant has the same term, then list promo use separately so the buyer can see the scope clearly." },
    { author: "Kavya Raman", initials: "KR", time: "8 min ago", body: "A short rights note beside the track helps. We also call out which records were checked and any gaps that still need follow-up." },
    { author: "Arjun Mehta", initials: "AM", time: "2 min ago", body: "Thanks, this is useful. We usually need social cutdowns too, so I will ask for those as a separate line item." },
  ],
  "post-tamil-sync": [
    { author: "Ananya Rao", initials: "AR", time: "1 hr ago", body: "The parent link is especially helpful. Our team still wants an individual clearance note for each edit." },
    { author: "Meena Sundaram", initials: "MS", time: "48 min ago", body: "We include whether the clean version was actually delivered and reviewed, rather than assuming it exists." },
  ],
  "post-first-quote": [
    { author: "Kavya Raman", initials: "KR", time: "Yesterday", body: "We send a compact shortlist first, then a separate rights summary with the checked fields and open questions." },
    { author: "Ananya Rao", initials: "AR", time: "Yesterday", body: "A simple table with title, version, fit, and a short caveat has worked well for our producers." },
  ],
  "post-roundtable": [
    { author: "Nikhil Varma", initials: "NV", time: "Sep 28", body: "Registered. Looking forward to hearing how other regional teams handle their intake." },
  ],
};

export function CommunityPage() {
  const { posts, addPost: addSamplePost } = useShowcase();
  const [category, setCategory] = useState<CommunityCategory>("All activity");
  const [liked, setLiked] = useState<string[]>([]);
  const [joinedEvents, setJoinedEvents] = useState<string[]>([]);
  const [followedMembers, setFollowedMembers] = useState<string[]>([]);
  const [composing, setComposing] = useState(false);
  const [draft, setDraft] = useState({ title: "", body: "" });
  const shownPosts = useMemo(() => category === "All activity" ? posts : posts.filter((post) => post.category === (category === "Announcements" ? "Announcement" : category)), [category, posts]);

  const publish = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const post = { id: `post-demo-${Date.now()}`, author: "You", role: "Pyramid member", initials: "YU", category: "Ask the community", time: "Just now", title: draft.title, body: draft.body, tags: ["New discussion"], likes: 0, replies: 0 };
    addSamplePost(post);
    setCategory("All activity");
    setDraft({ title: "", body: "" });
    setComposing(false);
  };
  const toggleLike = (id: string) => setLiked((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]);

  return <div className="showcase-stack">
    <DemoDataNotice>Community preview · sample member profiles, discussions, and event attendance.</DemoDataNotice>
    <MetricTiles items={[
      { label: "Members", value: 248, note: "Rights and catalogue teams", icon: <UsersRound size={14} />, tone: "good" },
      { label: "Active discussions", value: 16, note: "Across 5 topic groups", icon: <MessageCircle size={14} /> },
      { label: "Upcoming sessions", value: demoEvents.length, note: "Peer learning this month", icon: <CalendarDays size={14} />, tone: "warning" },
    ]} />
    <div className="community-layout"><section className="community-feed-column">
      <div className="showcase-panel community-feed-head"><div className="showcase-tabs community-categories" role="tablist" aria-label="Community categories">{(["All activity", "Rights practice", "Catalogue tips", "Ask the community", "Announcements", "Events"] as CommunityCategory[]).map((item) => <button type="button" role="tab" aria-selected={category === item} className={category === item ? "active" : ""} key={item} onClick={() => setCategory(item)}>{item}</button>)}</div><button className="button" type="button" onClick={() => setComposing(true)}><Plus size={13} />Start a discussion</button></div>
      {category === "Events" ? <section className="community-event-list">{demoEvents.map((event) => <article className="showcase-panel community-event-card" key={event.id}><div className="community-event-date"><CalendarDays size={16} /><span>{event.date.split(" · ")[0]}</span></div><div className="community-event-info"><strong>{event.title}</strong><small>{event.format} · {event.attendees + (joinedEvents.includes(event.id) ? 1 : 0)} attending</small><p>Share practical ways to organize catalogue and licensing work with peers.</p></div><button type="button" className={`button ${joinedEvents.includes(event.id) ? "secondary" : ""}`} onClick={() => setJoinedEvents((items) => items.includes(event.id) ? items.filter((item) => item !== event.id) : [...items, event.id])}>{joinedEvents.includes(event.id) ? "Interested" : "I'm interested"}</button></article>)}</section> : <div className="community-post-list">{shownPosts.map((post) => <article className="showcase-panel community-post" key={post.id}>
        <div className="community-post-byline"><InitialAvatar name={post.author} tone={post.initials === "AR" ? "blue" : post.initials === "MS" ? "peach" : "green"} /><div><strong>{post.author}</strong><small>{post.role}</small></div><span className="community-post-age">{post.time}</span></div>
        <div className="community-post-category"><ToneTag tone={post.category === "Rights practice" ? "purple" : post.category === "Announcements" ? "blue" : "neutral"}>{post.category}</ToneTag></div>
        <h2><Link href={`/community/posts/${post.id}`}>{post.title}</Link></h2><p className="community-post-body">{post.body}</p>
        <div className="community-tag-list">{post.tags.map((tag) => <span key={tag}>#{tag.toLowerCase().replaceAll(" ", "")}</span>)}</div>
        <div className="community-post-actions"><button type="button" className={liked.includes(post.id) ? "liked" : ""} onClick={() => toggleLike(post.id)}><Heart size={14} fill={liked.includes(post.id) ? "currentColor" : "none"} />{post.likes + (liked.includes(post.id) ? 1 : 0)} helpful</button><Link href={`/community/posts/${post.id}`}><MessageCircle size={14} />{post.replies} replies</Link><Link className="community-open-link" href={`/community/posts/${post.id}`}>Open discussion <ArrowRight size={12} /></Link></div>
      </article>)}</div>}
      {category !== "Events" && shownPosts.length === 0 && <div className="showcase-panel notification-empty"><strong>No posts in this topic yet</strong><span>Start the first sample discussion for this category.</span><button className="button secondary" type="button" onClick={() => setComposing(true)}><Plus size={12} />Start a discussion</button></div>}
    </section>
    <aside className="community-aside"><section className="showcase-panel"><PanelTitle title="Upcoming events" detail="Peer sessions for the community." />{demoEvents.map((event) => <div className="community-mini-event" key={event.id}><span className="community-mini-icon"><CalendarDays size={14} /></span><div><strong>{event.title}</strong><small>{event.date}</small><span>{event.attendees} members interested</span></div></div>)}<button type="button" className="inline-link" onClick={() => setCategory("Events")}>Browse events <ArrowRight size={12} /></button></section>
      <section className="showcase-panel"><PanelTitle title="People to know" detail="Sample members active this week." />{demoCommunityMembers.map((member, index) => <div className="community-member-row" key={member.name}><InitialAvatar name={member.name} tone={index % 2 ? "peach" : "blue"} /><span><strong>{member.name}</strong><small>{member.role} · {member.location}</small></span><button type="button" aria-label={`Follow ${member.name}`} title={`${member.organization} community member`} onClick={() => setFollowedMembers((items) => items.includes(member.name) ? items.filter((name) => name !== member.name) : [...items, member.name])}>{followedMembers.includes(member.name) ? "Following" : <ArrowRight size={13} />}</button></div>)}<Link className="inline-link" href="/clients">Explore client directory <ArrowRight size={12} /></Link></section>
      <section className="community-guidelines"><strong>A thoughtful space</strong><p>Share practical workflows. Keep private contracts, buyer details, and unreleased materials out of public discussions.</p><Link href="/community">Community guide <ArrowRight size={12} /></Link></section>
    </aside></div>
    {composing && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setComposing(false); }}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="community-compose-title"><div className="modal-head"><div><h2 id="community-compose-title">Start a discussion</h2><p>This draft will appear only in this preview session.</p></div><button className="icon-button" type="button" aria-label="Close" onClick={() => setComposing(false)}><X size={15} /></button></div><form onSubmit={publish}><div className="form-grid"><div className="form-field full"><label htmlFor="post-title">Discussion title</label><input id="post-title" required value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} /></div><div className="form-field full"><label htmlFor="post-body">What would you like to discuss?</label><textarea id="post-body" required rows={5} value={draft.body} onChange={(event) => setDraft({ ...draft, body: event.target.value })} /></div></div><div className="modal-actions"><button className="button secondary" type="button" onClick={() => setComposing(false)}>Cancel</button><button className="button"><Send size={13} />Post to preview</button></div></form></section></div>}
  </div>;
}

export function CommunityPostPage({ postId }: { postId: string }) {
  const { posts, repliesByPost, addReply: addSampleReply } = useShowcase();
  const post = posts.find((item) => item.id === postId) ?? (postId.startsWith("post-demo-") ? {
    id: postId, author: "You", role: "Pyramid member", initials: "YU", category: "Ask the community", time: "Just now",
    title: "New community discussion", body: "This sample discussion was just created in the preview session. Refreshing the page resets demo activity.", tags: ["New discussion"], likes: 0, replies: 0,
  } : undefined);
  const [liked, setLiked] = useState(false);
  const [reply, setReply] = useState("");
  const replies = repliesByPost[postId] ?? sampleReplies[postId] ?? [];
  if (!post) return <section className="showcase-panel notification-empty"><strong>Discussion not found</strong><Link href="/community" className="inline-link"><ArrowLeft size={12} />Back to community</Link></section>;
  const addReply = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addSampleReply(postId, { author: "You", initials: "YU", time: "Just now", body: reply });
    setReply("");
  };

  return <div className="showcase-stack"><DemoDataNotice>Sample community discussion · comments you add stay in this page session only.</DemoDataNotice><Link href="/community" className="inline-link"><ArrowLeft size={12} />Back to community</Link><section className="showcase-panel community-detail-post"><div className="community-post-byline"><InitialAvatar name={post.author} tone="blue" /><div><strong>{post.author}</strong><small>{post.role}</small></div><span className="community-post-age">{post.time}</span></div><ToneTag tone="purple">{post.category}</ToneTag><h2>{post.title}</h2><p className="community-post-body">{post.body}</p><div className="community-tag-list">{post.tags.map((tag) => <span key={tag}>#{tag.toLowerCase().replaceAll(" ", "")}</span>)}</div><div className="community-post-actions"><button type="button" className={liked ? "liked" : ""} onClick={() => setLiked((value) => !value)}><Heart size={14} fill={liked ? "currentColor" : "none"} />{post.likes + (liked ? 1 : 0)} helpful</button><span><MessageCircle size={14} />{replies.length} replies</span></div></section><section className="showcase-panel"><PanelTitle title="Conversation" detail={`${replies.length} sample replies`} /><div className="community-replies">{replies.map((item, index) => <article className="community-reply" key={`${item.author}-${item.time}-${index}`}><InitialAvatar name={item.author} tone={index % 2 ? "peach" : "green"} /><div><div className="community-reply-byline"><strong>{item.author}</strong><small>{item.time}</small></div><p>{item.body}</p></div></article>)}</div><form className="community-reply-form" onSubmit={addReply}><InitialAvatar name="You" /><input aria-label="Write a reply" required value={reply} onChange={(event) => setReply(event.target.value)} placeholder="Add a practical note or question…" /><button className="button" aria-label="Send reply"><Send size={13} />Reply</button></form></section></div>;
}
