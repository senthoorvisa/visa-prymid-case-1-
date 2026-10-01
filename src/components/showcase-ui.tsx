import type { ReactNode } from "react";
import Link from "next/link";

export type Metric = { label: string; value: string | number; note: string; icon: ReactNode; tone?: "good" | "warning" | "neutral" };

export function DemoDataNotice({ children = "Illustrative sample data · changes are not saved or synced." }: { children?: ReactNode }) {
  return <div className="showcase-note"><span className="showcase-note-mark">D</span><p>{children}</p></div>;
}

export function MetricTiles({ items }: { items: Metric[] }) {
  return <div className="showcase-metrics">{items.map((item) => <article className="showcase-metric" key={item.label}><div className="showcase-metric-top"><span>{item.label}</span><span className="showcase-metric-icon">{item.icon}</span></div><strong>{item.value}</strong><small className={item.tone ?? "neutral"}>{item.note}</small></article>)}</div>;
}

export function ToneTag({ children, tone = "neutral" }: { children: ReactNode; tone?: "good" | "warning" | "danger" | "neutral" | "purple" | "blue" }) {
  return <span className={`showcase-tag ${tone}`}>{children}</span>;
}

export function SectionTabs({ items }: { items: { label: string; href: string; active: boolean }[] }) {
  return <nav className="showcase-tabs" aria-label="Section pages">{items.map((item) => <Link key={item.href} href={item.href} className={item.active ? "active" : ""} aria-current={item.active ? "page" : undefined}>{item.label}</Link>)}</nav>;
}

export function PanelTitle({ title, detail, action }: { title: string; detail?: string; action?: ReactNode }) {
  return <div className="showcase-panel-title"><div><h2>{title}</h2>{detail && <p>{detail}</p>}</div>{action}</div>;
}

export function InitialAvatar({ name, tone = "green" }: { name: string; tone?: "green" | "blue" | "peach" | "lavender" }) {
  const initials = name.split(/[\s@._-]+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");
  return <span className={`showcase-avatar ${tone}`} aria-hidden="true">{initials || "P"}</span>;
}
