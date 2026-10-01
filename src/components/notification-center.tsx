"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Bell, Check, Lightbulb, MessageCircle, Sparkles, X } from "lucide-react";
import type { DemoNotification } from "@/lib/showcase-data";
import { DemoDataNotice, InitialAvatar, ToneTag } from "@/components/showcase-ui";
import { useShowcase } from "@/components/showcase-provider";

type NoticeFilter = "All" | "Suggestions" | "Updates" | "Community";

function noticeIcon(kind: DemoNotification["kind"]) {
  if (kind === "Suggestion") return <Lightbulb size={14} />;
  if (kind === "Community") return <MessageCircle size={14} />;
  return <Sparkles size={14} />;
}

export function NotificationCenter() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useShowcase();
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<NoticeFilter>("All");
  const unreadCount = notifications.filter((notice) => notice.unread).length;
  const visible = notifications.filter((notice) => filter === "All" || notice.kind === filter.slice(0, -1) || notice.kind === filter);

  return <div className="notification-anchor">
    <button className="top-icon notification-trigger" type="button" aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`} aria-expanded={open} onClick={() => setOpen((value) => !value)}>
      <Bell size={15} />{unreadCount > 0 && <span className="notification-count">{unreadCount}</span>}
    </button>
    {open && <section className="notification-popover" aria-label="Notifications">
      <div className="notification-popover-head"><div><strong>Updates & suggestions</strong><span>{unreadCount} new · demo inbox</span></div><button type="button" className="icon-button" aria-label="Close notifications" onClick={() => setOpen(false)}><X size={14} /></button></div>
      <div className="notification-filter">{(["All", "Suggestions", "Updates", "Community"] as NoticeFilter[]).map((item) => <button type="button" key={item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>{item}</button>)}</div>
      <div className="notification-items">{visible.slice(0, 5).map((notice) => {
        const unread = notice.unread;
        return <Link key={notice.id} href={notice.href} className={`notification-item ${unread ? "unread" : ""}`} onClick={() => { markNotificationRead(notice.id); setOpen(false); }}>
          <span className={`notification-kind-icon ${notice.kind.toLowerCase()}`}>{noticeIcon(notice.kind)}</span>
          <span className="notification-copy"><strong>{notice.title}</strong><span>{notice.detail}</span><small>{notice.age} <i>·</i> {notice.kind}</small></span>
          {unread && <span className="notification-unread-dot" aria-label="Unread" />}
        </Link>;
      })}</div>
      <div className="notification-popover-foot"><button type="button" className="notification-mark-read" onClick={markAllNotificationsRead}><Check size={12} />Mark all read</button><Link href="/notifications" onClick={() => setOpen(false)}>Open inbox <ArrowRight size={12} /></Link></div>
      <DemoDataNotice>Sample messages only. Your team’s notices will sync when a backend is connected.</DemoDataNotice>
    </section>}
  </div>;
}

export function NotificationsPage() {
  const { notifications, markNotificationRead, markAllNotificationsRead, dismissNotification } = useShowcase();
  const [filter, setFilter] = useState<NoticeFilter>("All");
  const visible = notifications.filter((notice) => filter === "All" || notice.kind === filter.slice(0, -1) || notice.kind === filter);

  return <div className="showcase-stack">
    <DemoDataNotice>These are sample notifications for the product preview. Suggestions and lower-priority updates are grouped here for staff review.</DemoDataNotice>
    <section className="showcase-panel">
      <div className="showcase-panel-heading"><div><h2>Notification inbox</h2><p>Rights reminders, request suggestions, and community updates in one place.</p></div><button className="button secondary" type="button" onClick={markAllNotificationsRead}><Check size={13} />Mark all read</button></div>
      <div className="notification-page-filters">{(["All", "Suggestions", "Updates", "Community"] as NoticeFilter[]).map((item) => <button type="button" key={item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>{item}<span>{item === "All" ? notifications.length : notifications.filter((notice) => notice.kind === item.slice(0, -1) || notice.kind === item).length}</span></button>)}</div>
      <div className="notification-page-list">{visible.length ? visible.map((notice) => {
        const unread = notice.unread;
        return <article className={`notification-page-item ${unread ? "unread" : ""}`} key={notice.id}>
          <span className={`notification-kind-icon ${notice.kind.toLowerCase()}`}>{noticeIcon(notice.kind)}</span>
          <div className="notification-page-copy"><div className="notification-page-meta"><ToneTag tone={notice.kind === "Suggestion" ? "purple" : notice.kind === "Community" ? "blue" : "neutral"}>{notice.kind}</ToneTag><span>{notice.age}</span></div><strong>{notice.title}</strong><p>{notice.detail}</p><Link className="inline-link" href={notice.href} onClick={() => markNotificationRead(notice.id)}>Open related page <ArrowRight size={12} /></Link></div>
          {unread && <button type="button" className="notification-read-button" onClick={() => markNotificationRead(notice.id)}>Mark read</button>}
          <button type="button" className="icon-button notification-dismiss" aria-label={`Dismiss ${notice.title}`} onClick={() => dismissNotification(notice.id)}><X size={13} /></button>
        </article>;
      }) : <div className="notification-empty"><InitialAvatar name="Pyramid" /><strong>You’re all caught up</strong><span>New reminders and suggestions will appear here.</span></div>}</div>
    </section>
  </div>;
}
