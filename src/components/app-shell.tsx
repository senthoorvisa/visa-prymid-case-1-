"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { useDemoAuth } from "@/components/auth-provider";
import {
  Activity, ArrowDownRight, ArrowRight, AudioLines, Check, ChevronDown,
  BriefcaseBusiness, CircleHelp, Clapperboard, Clock3, Disc3, FileMusic, Film, Filter,
  Headphones, LayoutDashboard, ListMusic, LogOut, MessagesSquare, Pencil, Plus, Search,
  Settings2, ShieldCheck, Sparkles, Trash2, TrendingUp, Upload, Users, X, RotateCw,
} from "lucide-react";
import { getSupabase } from "@/lib/supabase";
import { SupabaseAuthService } from "@/lib/auth-service";
import { formatDate, initials, titleCase, type Section } from "@/lib/format";
import type { ProfileRole } from "@/types/database";
import { makeDemoWorkspace, getDemoEligibility, getDemoRows } from "@/lib/showcase-data";
import { NotificationCenter, NotificationsPage } from "@/components/notification-center";
import { CRMPage, ClientDetailPage } from "@/components/crm-pages";
import { CommunityPage, CommunityPostPage } from "@/components/community-pages";
import { LicensingInboxPage, LicensingRequestPage, HoldsPage, DealsPage, RenewalsPage, BuyerPackagePage } from "@/components/licensing-pages";
import { InsightsPage } from "@/components/insights-page";
import { CatalogueSetupPage, SongVersionPage } from "@/components/catalogue-pages";

type UiRow = Record<string, unknown>;
type EditorKind = "film" | "song" | "right";
type IconComponent = typeof LayoutDashboard;
const TODAY_START_MS = (() => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
})();

const navItems: { id: Section; label: string; icon: IconComponent }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "catalogue", label: "Catalogue", icon: Clapperboard },
  { id: "rights", label: "Rights ledger", icon: ShieldCheck },
  { id: "usage", label: "Usage log", icon: Activity },
  { id: "compilations", label: "Compilations", icon: ListMusic },
  { id: "licensing", label: "Licensing", icon: BriefcaseBusiness },
  { id: "clients", label: "CRM · Clients", icon: Users },
  { id: "community", label: "Community", icon: MessagesSquare },
  { id: "insights", label: "Insights", icon: TrendingUp },
];
const adminItems: { id: Section; label: string; icon: IconComponent }[] = [
  { id: "team", label: "Team & audit", icon: Users },
  { id: "settings", label: "Settings", icon: Settings2 },
];

function text(row: UiRow | null | undefined, key: string, fallback = "—") {
  const value = row?.[key];
  return value === null || value === undefined || value === "" ? fallback : String(value);
}
function relation(row: UiRow | null | undefined, key: string): UiRow | null {
  const value = row?.[key];
  return value && typeof value === "object" && !Array.isArray(value) ? value as UiRow : null;
}
function relationList(row: UiRow | null | undefined, key: string): UiRow[] {
  const value = row?.[key];
  return Array.isArray(value) ? value.filter((item): item is UiRow => Boolean(item && typeof item === "object")) : [];
}
function Brand() {
  return <div className="brand"><div className="brand-mark"><LayersMark /></div><span className="brand-name">pyramid</span></div>;
}
function LayersMark() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 1.5 14 5 8 8.5 2 5 8 1.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><path d="m2 8 6 3.5L14 8M2 11l6 3.5 6-3.5" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>;
}

function Status({ value }: { value: string }) {
  const status = value === "—" ? "neutral" : value;
  return <span className={`status ${status}`}>{titleCase(status)}</span>;
}

function MetricCard({ title, value, note, icon: Icon, tone }: { title: string; value: string | number; note: string; icon: IconComponent; tone?: string }) {
  return <div className="metric-card"><div className="metric-top"><span>{title}</span><span className="metric-icon"><Icon size={14} /></span></div><div className="metric-value">{value}</div><div className={`metric-note ${tone ?? ""}`}>{note}</div></div>;
}

function EmptyState({ title, detail, icon: Icon = FileMusic, action }: { title: string; detail: string; icon?: IconComponent; action?: React.ReactNode }) {
  return <div className="empty-state"><div className="empty-icon"><Icon size={17} /></div><h3>{title}</h3><p>{detail}</p>{action}</div>;
}

function AuthPanel({ demoMode, onSignedIn }: { demoMode: boolean; onSignedIn: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const supabase = getSupabase();
  const demoAuth = useDemoAuth();
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true); setError("");
    try {
      if (demoMode) await demoAuth.signIn(email, password);
      else if (supabase) { await new SupabaseAuthService(supabase).signIn(email, password); onSignedIn(); }
    } catch (signInError) {
      setError(signInError instanceof Error ? signInError.message : "Sign in failed.");
    } finally { setLoading(false); }
  };
  return <main className="login-screen"><section className="login-card"><div className="login-brand"><div className="brand-mark"><LayersMark /></div><span className="brand-name">pyramid</span></div><p className="eyebrow">{demoMode ? "Sample preview" : "Rights workspace"}</p><h1>{demoMode ? "Enter the workspace" : "Welcome back"}</h1><p className="subheading">{demoMode ? "Explore a sample catalogue, licensing workflow, CRM, and community. Supabase can be connected later." : "Sign in to your shared film and music catalogue."}</p>{error && <div className="error-banner">{error}</div>}<form className="login-fields" onSubmit={submit}><div className="form-field"><label htmlFor="email">Email address</label><input id="email" autoComplete="email" type={demoMode ? "text" : "email"} value={email} onChange={(event) => setEmail(event.target.value)} required={!demoMode} placeholder={demoMode ? "Optional in sample mode" : undefined} /></div><div className="form-field"><label htmlFor="password">Password</label><input id="password" autoComplete={demoMode ? "off" : "current-password"} type="password" value={password} onChange={(event) => setPassword(event.target.value)} required={!demoMode} placeholder={demoMode ? "Optional in sample mode" : undefined} /></div><button className="button" type="submit" disabled={loading}>{loading ? "Opening…" : demoMode ? "Sign in to sample" : "Sign in"}<ArrowRight size={13} /></button></form>{demoMode && <button className="button secondary" style={{ width: "100%", marginTop: 8 }} disabled={loading} onClick={() => void demoAuth.continueAsGuest()}>Continue as guest</button>}<p className="login-footnote">{demoMode ? "Demo only: no real authentication. Sample changes stay in memory and reset when you refresh." : "Access is managed by your Pyramid workspace administrator."}</p></section></main>;
}

function PageHeading({ section, onCreate, canWrite, builderOpen, onToggleBuilder }: { section: Section; onCreate: (kind: EditorKind) => void; canWrite: boolean; builderOpen: boolean; onToggleBuilder: () => void }) {
  const info: Record<Section, { title: string; eyebrow: string; sub: string }> = {
    dashboard: { title: "Rights at a glance", eyebrow: "Workspace overview", sub: "A clear view of what your catalogue owns and what needs attention." },
    catalogue: { title: "Catalogue", eyebrow: "Films & music", sub: "Keep film and song metadata tidy in one shared catalogue." },
    "catalogue-setup": { title: "Catalogue migration", eyebrow: "Import & compare", sub: "Map workbook columns, resolve data issues, and review changes before import." },
    rights: { title: "Rights ledger", eyebrow: "Licenses & territories", sub: "Track ownership windows and the dates your team needs to act on." },
    usage: { title: "Usage log", eyebrow: "Compilation history", sub: "Every song placement, with its compilation and use date." },
    compilations: { title: builderOpen ? "Build a compilation" : "Compilations", eyebrow: "Song reuse & clearances", sub: builderOpen ? "Choose a territory, check eligibility, and save a cleared selection." : "Review past releases or build the next compilation from cleared songs." },
    licensing: { title: "Licensing requests", eyebrow: "Request inbox", sub: "Manage buyer briefs, candidate songs, rights checks, and quotes." },
    holds: { title: "Holds & conflicts", eyebrow: "Offer coordination", sub: "Track temporary holds by song, territory, media, and end date." },
    deals: { title: "Quotes & licenses", eyebrow: "Commercial workflow", sub: "Follow a shortlist from quote through a recorded customer license." },
    renewals: { title: "Renewals & options", eyebrow: "Follow-up calendar", sub: "Keep catalogue-rights expiries and customer-license dates distinct." },
    clients: { title: "Client relationship management", eyebrow: "Accounts & contacts", sub: "See client context, licensing opportunities, and follow-up activity together." },
    community: { title: "Pyramid community", eyebrow: "Peer workspace", sub: "Explore sample discussions, member ideas, and learning events." },
    insights: { title: "Demand & opportunities", eyebrow: "Catalogue insights", sub: "See what buyers asked for and where interest did not progress." },
    notifications: { title: "Notification inbox", eyebrow: "Updates & suggestions", sub: "Keep reminders, ideas, and lower-priority workspace updates in one place." },
    settings: { title: "Workspace settings", eyebrow: "Policies & preferences", sub: "Set the rights warning window and song reuse cooldown for your team." },
    team: { title: "Team & audit", eyebrow: "Access & activity", sub: "Review workspace roles and see changes recorded in the audit trail." },
  };
  const { title, eyebrow, sub } = info[section];
  const action = section === "catalogue" ? <><Link href="/catalogue-setup" className="button secondary"><Upload size={13} />Import & compare</Link><button className="button" onClick={() => onCreate("film")} disabled={!canWrite}><Plus size={13} />Add film</button></>
    : section === "rights" ? <button className="button" onClick={() => onCreate("right")} disabled={!canWrite}><Plus size={13} />Add rights</button>
    : section === "compilations" ? <button className="button" onClick={onToggleBuilder}><Plus size={13} />{builderOpen ? "View compilations" : "New compilation"}</button> : null;
  return <div className="page-heading"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="subheading">{sub}</p></div><div style={{ display: "flex", gap: 8 }}>{section === "catalogue" && <button className="button secondary" onClick={() => onCreate("song")} disabled={!canWrite}><Plus size={13} />Add song</button>}{action}</div></div>;
}

function RecordEditor({ kind, initial, films, onClose, onSave, busy }: { kind: EditorKind; initial: UiRow | null; films: UiRow[]; onClose: () => void; onSave: (payload: UiRow) => void; busy: boolean }) {
  const [fields, setFields] = useState<UiRow>(() => ({ ...initial }));
  const set = (key: string, value: unknown) => setFields((previous) => ({ ...previous, [key]: value }));
  const title = kind === "film" ? "film" : kind === "song" ? "song" : "rights record";
  const input = (key: string, label: string, type = "text", required = false) => <div className="form-field"><label htmlFor={key}>{label}</label><input id={key} type={type} required={required} value={text(fields, key, "")} onChange={(event) => set(key, type === "number" ? (event.target.value ? Number(event.target.value) : null) : event.target.value)} /></div>;
  const filmSelector = (required = false) => <div className="form-field"><label htmlFor="film_id">Film</label><select id="film_id" required={required} value={text(fields, "film_id", "")} onChange={(event) => set("film_id", event.target.value || null)}><option value="">Select a film</option>{films.map((film) => <option key={text(film, "id")} value={text(film, "id")}>{text(film, "title")}</option>)}</select></div>;
  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="editor-title"><div className="modal-head"><div><h2 id="editor-title">{initial ? "Edit" : "Add"} {title}</h2><p>Changes are saved directly to your shared database.</p></div><button className="icon-button" onClick={onClose} aria-label="Close"><X size={15} /></button></div><form onSubmit={(event) => { event.preventDefault(); onSave(fields); }}><div className="form-grid">{kind === "film" && <>{input("title", "Film title", "text", true)}{input("release_year", "Release year", "number")}{input("language", "Language")}{input("genre", "Genre")}<div className="form-field full"><label htmlFor="synopsis">Synopsis</label><textarea id="synopsis" value={text(fields, "synopsis", "")} onChange={(event) => set("synopsis", event.target.value)} /></div></>}{kind === "song" && <>{input("title", "Song title", "text", true)}{filmSelector(true)}{input("singer", "Singer")}{input("language", "Language")}{input("genre", "Genre")}{input("year", "Year", "number")}</>}{kind === "right" && <>{filmSelector(true)}{input("owner", "Rights owner", "text", true)}{input("territory", "Territory", "text", true)}{input("start_date", "Start date", "date", true)}{input("license_period_months", "License period (months)", "number")}<label className="checkbox-field"><input type="checkbox" checked={fields.is_perpetual === true} onChange={(event) => set("is_perpetual", event.target.checked)} />Perpetual rights</label></>}</div><div className="modal-actions"><button className="button secondary" type="button" onClick={onClose}>Cancel</button><button className="button" disabled={busy}><Check size={13} />{busy ? "Saving…" : "Save changes"}</button></div></form></section></div>;
}

function ImportModal({ films, onClose, onImport, busy }: { films: UiRow[]; onClose: () => void; onImport: (kind: "films" | "songs" | "rights", rows: UiRow[]) => void; busy: boolean }) {
  const [worksheets, setWorksheets] = useState<{ name: string; rows: UiRow[] }[]>([]);
  const [selectedSheet, setSelectedSheet] = useState("");
  const [kind, setKind] = useState<"films" | "songs" | "rights">("films");
  const [message, setMessage] = useState("");
  const rows = worksheets.find((sheet) => sheet.name === selectedSheet)?.rows ?? [];
  const parseFile = async (file: File | undefined) => {
    if (!file) return;
    setMessage("");
    try {
      const ExcelJS = await import("exceljs");
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(await file.arrayBuffer());
      const parsedSheets = workbook.worksheets.map((sheet) => {
        const headers: string[] = [];
        sheet.getRow(1).eachCell((cell, columnNumber) => { headers[columnNumber - 1] = cell.text.toLowerCase().trim().replace(/[\s-]+/g, "_"); });
        const parsed: UiRow[] = [];
        sheet.eachRow((line, rowNumber) => {
          if (rowNumber === 1) return;
          const row: UiRow = {};
          headers.forEach((header, index) => {
            const value = line.getCell(index + 1).value;
            row[header] = value && typeof value === "object" && "text" in value ? value.text : value instanceof Date ? value.toISOString().slice(0, 10) : value;
          });
          parsed.push(row);
        });
        return { name: sheet.name, rows: parsed };
      });
      setWorksheets(parsedSheets);
      setSelectedSheet(parsedSheets[0]?.name ?? "");
      setMessage(`${parsedSheets.length} worksheet${parsedSheets.length === 1 ? "" : "s"} found. Choose a sheet to preview.`);
    } catch { setMessage("That file could not be read. Choose an Excel .xlsx workbook."); }
  };
  const validRows = rows.filter((row) => {
    if (typeof row.title !== "string" || !row.title.trim()) return false;
    const filmTitle = String(row.film ?? row.film_title ?? "").toLowerCase();
    const hasFilm = films.some((film) => text(film, "title").toLowerCase() === filmTitle);
    if (kind === "songs") return Boolean(filmTitle && hasFilm);
    if (kind === "rights") return Boolean(row.owner && row.territory && row.start_date && hasFilm);
    return true;
  });
  const badRows = rows.length - validRows.length;
  const mapped = validRows.map((row) => {
    const filmTitle = String(row.film ?? row.film_title ?? "").toLowerCase();
    const filmId = films.find((film) => text(film, "title").toLowerCase() === filmTitle)?.id ?? null;
    if (kind === "films") return { title: String(row.title).trim(), release_year: row.release_year ? Number(row.release_year) : null, language: row.language ? String(row.language) : null, genre: row.genre ? String(row.genre) : null, synopsis: row.synopsis ? String(row.synopsis) : null };
    if (kind === "songs") return { title: String(row.title).trim(), singer: row.singer ? String(row.singer) : null, language: row.language ? String(row.language) : null, genre: row.genre ? String(row.genre) : null, year: row.year ? Number(row.year) : null, film_id: filmId };
    return { film_id: filmId, owner: String(row.owner).trim(), territory: String(row.territory).trim(), start_date: String(row.start_date).slice(0, 10), license_period_months: row.license_period_months ? Number(row.license_period_months) : null, is_perpetual: [true, "true", "yes", 1].includes(row.is_perpetual as never) };
  });
  const columnHint = kind === "films" ? "title, release_year, language, genre, synopsis" : kind === "songs" ? "title, film, singer, language, genre, year" : "title, film, owner, territory, start_date, license_period_months, is_perpetual";
  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="import-title"><div className="modal-head"><div><h2 id="import-title">Import catalogue workbook</h2><p>Choose a sheet, preview rows, then confirm before writing to Postgres.</p></div><button className="icon-button" onClick={onClose} aria-label="Close"><X size={15} /></button></div><div className="form-grid"><div className="form-field"><label htmlFor="import-kind">Map this sheet to</label><select id="import-kind" value={kind} onChange={(event) => setKind(event.target.value as "films" | "songs" | "rights")}><option value="films">Films</option><option value="songs">Songs</option><option value="rights">Rights</option></select></div><div className="form-field"><label htmlFor="workbook">Workbook</label><input id="workbook" type="file" accept=".xlsx" onChange={(event) => void parseFile(event.target.files?.[0])} /></div>{worksheets.length > 0 && <div className="form-field full"><label htmlFor="sheet">Worksheet</label><select id="sheet" value={selectedSheet} onChange={(event) => setSelectedSheet(event.target.value)}>{worksheets.map((sheet) => <option key={sheet.name}>{sheet.name}</option>)}</select></div>}</div>{message && <p className="subheading">{message}</p>}{rows.length > 0 && <><p className="subheading">{validRows.length} valid · {badRows} skipped. Required and recognized columns: {columnHint}. {kind === "rights" && "Rights rows need a matching film already in the catalogue."}</p><div className="table-wrap" style={{ maxHeight: 230 }}><table><thead><tr><th>Title</th><th>{kind === "films" ? "Year" : kind === "rights" ? "Owner" : "Singer"}</th><th>Validation</th></tr></thead><tbody>{rows.slice(0, 12).map((row, index) => { const valid = validRows.includes(row); return <tr key={index}><td>{text(row, "title", "Missing title")}</td><td>{text(row, kind === "films" ? "release_year" : kind === "rights" ? "owner" : "singer")}</td><td><Status value={valid ? "active" : "expired"} /></td></tr>; })}</tbody></table></div></>}<div className="modal-actions"><button className="button secondary" onClick={onClose}>Cancel</button><button className="button" disabled={busy || mapped.length === 0} onClick={() => onImport(kind, mapped)}><Upload size={13} />{busy ? "Importing…" : `Confirm ${mapped.length} rows`}</button></div></section></div>;
}

export function AppShell({ section, clientId, requestId, songId, postId, packagePreview = false }: { section: Section; clientId?: string; requestId?: string; songId?: string; postId?: string; packagePreview?: boolean }) {
  const supabase = getSupabase();
  const demoAuth = useDemoAuth();
  const demoUser = demoAuth.user;
  const [session, setSession] = useState<Session | null>(null);
  const [authChecked, setAuthChecked] = useState(!supabase);
  const [role, setRole] = useState<ProfileRole>("viewer");
  const [rows, setRows] = useState<UiRow[]>([]);
  const [films, setFilms] = useState<UiRow[]>([]);
  const [eligibleRows, setEligibleRows] = useState<UiRow[]>([]);
  const [territories, setTerritories] = useState<string[]>([]);
  const [cataloguePage, setCataloguePage] = useState(0);
  const [catalogueTotal, setCatalogueTotal] = useState(0);
  const [territory, setTerritory] = useState("");
  const [selectedSongs, setSelectedSongs] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [builderOpen, setBuilderOpen] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [editorKind, setEditorKind] = useState<EditorKind | null>(null);
  const [editing, setEditing] = useState<UiRow | null>(null);
  const [songFilters, setSongFilters] = useState({ genre: "", singer: "", language: "", year: "" });
  const [settingsForm, setSettingsForm] = useState({ expiring_soon_days: "90", song_reuse_cooldown_days: "180" });
  const [dashboardCounts, setDashboardCounts] = useState({ films: 0, songs: 0, rights: 0, compilations: 0, active: 0, expiring: 0, expired: 0 });
  const canWrite = role === "admin" || role === "editor";
  const demoMode = !supabase;
  const title = section === "compilations" && builderOpen ? "Build a compilation" : section === "catalogue-setup" ? "Catalogue migration" : section === "clients" ? "Client relationship management" : section === "notifications" ? "Notification inbox" : section === "team" ? "Team & audit" : titleCase(section === "rights" ? "rights ledger" : section);

  useEffect(() => {
    if (!supabase) return;
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => { if (mounted) { setSession(data.session); setAuthChecked(true); } });
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => { setSession(nextSession); setAuthChecked(true); });
    return () => { mounted = false; data.subscription.unsubscribe(); };
  }, [supabase]);

  useEffect(() => {
    if (!supabase) {
      if (!demoUser) return;
      let ignore = false;
      queueMicrotask(() => {
        if (ignore) return;
        const workspace = makeDemoWorkspace();
        setError("");
        setFilms(workspace.films);
        setTerritories(workspace.territories);
        setTerritory((current) => current || workspace.territories[0]);
        setRows(getDemoRows(section, workspace));
        setCatalogueTotal(workspace.films.length);
        setDashboardCounts({
          films: workspace.films.length,
          songs: workspace.songs.length,
          compilations: workspace.compilations.length,
          rights: workspace.rights.length,
          active: workspace.rights.filter((row) => row.status === "active" || row.status === "perpetual").length,
          expiring: workspace.rights.filter((row) => row.status === "expiring_soon").length,
          expired: workspace.rights.filter((row) => row.status === "expired").length,
        });
      });
      return () => { ignore = true; };
    }
    if (!session?.user) return;
    let ignore = false;
    const load = async () => {
      if (["catalogue-setup", "licensing", "holds", "deals", "renewals", "clients", "community", "insights", "notifications"].includes(section)) {
        setRows([]);
        setLoading(false);
        return;
      }
      setLoading(true); setError("");
      const [{ data: profile }, { data: filmData }, { data: territoryData }] = await Promise.all([
        supabase.from("profiles").select("role").eq("id", session.user.id).maybeSingle(),
        supabase.from("films").select("id,title").order("title").limit(1000),
        supabase.from("rights").select("territory"),
      ]);
      if (ignore) return;
      if (profile?.role) setRole(profile.role);
      setFilms((filmData ?? []) as unknown as UiRow[]);
      const uniqueTerritories = [...new Set((territoryData ?? []).map((item) => item.territory))].sort();
      setTerritories(uniqueTerritories);
      if (!territory && uniqueTerritories.length) setTerritory(uniqueTerritories[0]);

      if (section === "dashboard") {
        const [filmCount, songCount, compilationCount, activeCount, expiringCount, expiredCount, rightsResult] = await Promise.all([
          supabase.from("films").select("id", { count: "exact", head: true }),
          supabase.from("songs").select("id", { count: "exact", head: true }),
          supabase.from("compilations").select("id", { count: "exact", head: true }),
          supabase.from("rights_status_view").select("id", { count: "exact", head: true }).in("status", ["active", "perpetual"]),
          supabase.from("rights_status_view").select("id", { count: "exact", head: true }).eq("status", "expiring_soon"),
          supabase.from("rights_status_view").select("id", { count: "exact", head: true }).eq("status", "expired"),
          supabase.from("rights_status_view").select("id,status,film_title,territory,expiry_date").order("expiry_date", { ascending: true, nullsFirst: false }).limit(100),
        ]);
        if (rightsResult.error) setError(rightsResult.error.message);
        const rightsRows = (rightsResult.data ?? []) as unknown as UiRow[];
        setRows(rightsRows);
        setDashboardCounts({ films: filmCount.count ?? 0, songs: songCount.count ?? 0, compilations: compilationCount.count ?? 0, rights: rightsRows.length, active: activeCount.count ?? 0, expiring: expiringCount.count ?? 0, expired: expiredCount.count ?? 0 });
      } else if (section === "catalogue") {
        let request = supabase.from("films").select("*, songs(id,title,singer,language,genre,year)", { count: "exact" });
        if (query.trim()) request = request.ilike("title", `%${query.trim()}%`);
        const result = await request.order("title").range(cataloguePage * 25, cataloguePage * 25 + 24);
        if (result.error) setError(result.error.message);
        setCatalogueTotal(result.count ?? 0);
        setRows((result.data ?? []) as unknown as UiRow[]);
      } else if (section === "rights") {
        const result = await supabase.from("rights_status_view").select("*").order("expiry_date", { ascending: true, nullsFirst: false }).limit(1000);
        if (result.error) setError(result.error.message);
        setRows((result.data ?? []) as unknown as UiRow[]);
      } else if (section === "usage") {
        const result = await supabase.from("compilation_items").select("*, songs(title,singer), compilations(name,territory,created_at)").order("added_at", { ascending: false }).limit(1000);
        if (result.error) setError(result.error.message);
        setRows((result.data ?? []) as unknown as UiRow[]);
      } else if (section === "compilations") {
        if (!builderOpen) {
          const result = await supabase.from("compilations").select("*, compilation_items(id,songs(title,singer))").order("created_at", { ascending: false }).limit(500);
          if (result.error) setError(result.error.message);
          setRows((result.data ?? []) as unknown as UiRow[]);
        }
      } else if (section === "settings") {
        const result = await supabase.from("app_settings").select("*").eq("id", true).maybeSingle();
        if (result.error) setError(result.error.message);
        if (result.data) setSettingsForm({ expiring_soon_days: String(result.data.expiring_soon_days), song_reuse_cooldown_days: String(result.data.song_reuse_cooldown_days) });
        setRows(result.data ? [result.data as unknown as UiRow] : []);
      } else if (section === "team") {
        const result = await supabase.from("profiles").select("id,email,role,created_at").order("created_at", { ascending: true }).limit(500);
        if (result.error) setError(result.error.message);
        setRows((result.data ?? []) as unknown as UiRow[]);
      } else {
        setRows([]);
      }
      if (!ignore) setLoading(false);
    };
    void load();
    return () => { ignore = true; };
  }, [supabase, session, demoUser, section, builderOpen, query, cataloguePage, territory]);

  useEffect(() => {
    if (section !== "compilations" || !builderOpen || !territory) return;
    if (!supabase) {
      if (!demoUser) return;
      let ignore = false;
      queueMicrotask(() => {
        if (!ignore) setEligibleRows(getDemoEligibility(territory, songFilters));
      });
      return () => { ignore = true; };
    }
    if (!session?.user) return;
    let ignore = false;
    const loadEligible = async () => {
      setLoading(true); setError("");
      let request = supabase.from("compilation_eligibility_view").select("*").eq("territory", territory).order("song_title");
      if (songFilters.genre) request = request.ilike("genre", `%${songFilters.genre}%`);
      if (songFilters.singer) request = request.ilike("singer", `%${songFilters.singer}%`);
      if (songFilters.language) request = request.ilike("language", `%${songFilters.language}%`);
      if (songFilters.year) request = request.eq("year", Number(songFilters.year));
      const result = await request.limit(1000);
      if (ignore) return;
      if (result.error) setError(result.error.message);
      setEligibleRows((result.data ?? []) as unknown as UiRow[]);
      setLoading(false);
    };
    void loadEligible();
    return () => { ignore = true; };
  }, [supabase, session, demoUser, section, builderOpen, territory, songFilters]);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const haystack = Object.values(row).filter((value) => typeof value === "string" || typeof value === "number").join(" ").toLowerCase();
      const matchesQuery = !query || haystack.includes(query.toLowerCase());
      const matchesStatus = statusFilter === "all" || (statusFilter.startsWith("within_")
        ? Boolean(row.expiry_date && new Date(`${text(row, "expiry_date")}T00:00:00`).getTime() >= TODAY_START_MS && new Date(`${text(row, "expiry_date")}T00:00:00`).getTime() <= TODAY_START_MS + Number(statusFilter.slice(7)) * 86400000)
        : text(row, "status") === statusFilter);
      return matchesQuery && matchesStatus;
    });
  }, [rows, query, statusFilter]);

  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(""), 3000); };
  const refreshCurrent = useCallback(() => { setRows((current) => [...current]); }, []);

  const saveRecord = async (payload: UiRow) => {
    if (!supabase || !editorKind) return;
    setBusy(true); setError("");
    const fieldsByKind: Record<EditorKind, string[]> = { film: ["title", "release_year", "language", "genre", "synopsis"], song: ["film_id", "title", "singer", "language", "genre", "year"], right: ["film_id", "owner", "territory", "start_date", "license_period_months", "is_perpetual"] };
    const record = Object.fromEntries(fieldsByKind[editorKind].map((key) => [key, payload[key]]).filter(([, value]) => value !== undefined));
    const id = editing?.id;
    let result: { error: { message: string } | null };
    if (editorKind === "film") result = id ? await supabase.from("films").update(record as never).eq("id", String(id)) : await supabase.from("films").insert(record as never);
    else if (editorKind === "song") result = id ? await supabase.from("songs").update(record as never).eq("id", String(id)) : await supabase.from("songs").insert(record as never);
    else result = id ? await supabase.from("rights").update(record as never).eq("id", String(id)) : await supabase.from("rights").insert(record as never);
    if (result.error) { setError(result.error.message); setBusy(false); return; }
    setBusy(false); setEditorKind(null); setEditing(null); notify(`${titleCase(editorKind)} saved.`); refreshCurrent();
    window.location.reload();
  };

  const deleteRecord = async (kind: "films" | "songs" | "rights", row: UiRow) => {
    const label = kind === "films" ? "film" : kind === "songs" ? "song" : "rights record";
    if (!supabase || !canWrite || !window.confirm(`Delete this ${label}? This cannot be undone.`)) return;
    const result = kind === "films" ? await supabase.from("films").delete().eq("id", String(row.id)) : kind === "songs" ? await supabase.from("songs").delete().eq("id", String(row.id)) : await supabase.from("rights").delete().eq("id", String(row.id));
    if (result.error) setError(result.error.message); else { notify("Record deleted."); window.location.reload(); }
  };

  const doImport = async (kind: "films" | "songs" | "rights", data: UiRow[]) => {
    if (!supabase) return;
    setBusy(true); setError("");
    let importError: string | null = null;
    for (let start = 0; start < data.length; start += 500) {
      const batch = data.slice(start, start + 500);
      const result = kind === "films" ? await supabase.from("films").upsert(batch as never, { onConflict: "title" })
        : kind === "songs" ? await supabase.from("songs").upsert(batch as never, { onConflict: "title,film_id" })
          : await supabase.from("rights").upsert(batch as never, { onConflict: "film_id,owner,territory,start_date" });
      if (result.error) { importError = result.error.message; break; }
    }
    if (importError) setError(importError); else { setShowImport(false); notify(`${data.length} ${kind} imported.`); window.location.reload(); }
    setBusy(false);
  };

  const saveCompilation = async () => {
    if (!supabase || !canWrite || selectedSongs.length === 0) return;
    const name = window.prompt("Name this compilation");
    if (!name?.trim()) return;
    setBusy(true); setError("");
    const result = await supabase.rpc("save_compilation", { p_name: name.trim(), p_territory: territory, p_song_ids: selectedSongs });
    if (result.error) setError(result.error.message); else { notify("Compilation saved. Song use is now logged."); setSelectedSongs([]); setBuilderOpen(false); window.location.reload(); }
    setBusy(false);
  };

  const saveSettings = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase || role !== "admin") return;
    setBusy(true); setError("");
    const result = await supabase.from("app_settings").upsert({ id: true, expiring_soon_days: Number(settingsForm.expiring_soon_days), song_reuse_cooldown_days: Number(settingsForm.song_reuse_cooldown_days), updated_by: session?.user.id } as never, { onConflict: "id" });
    if (result.error) setError(result.error.message); else notify("Workspace settings saved.");
    setBusy(false);
  };

  const updateRole = async (id: string, nextRole: ProfileRole) => {
    if (!supabase || role !== "admin") return;
    const result = await supabase.from("profiles").update({ role: nextRole }).eq("id", id);
    if (result.error) setError(result.error.message); else { notify("Team role updated."); window.location.reload(); }
  };

  if (!authChecked) return <main className="login-screen"><div className="login-card"><div className="skeleton" /><p className="subheading">Connecting to your workspace…</p></div></main>;
  if (!session && !demoUser) return <AuthPanel demoMode={demoMode} onSignedIn={() => { void supabase?.auth.getSession().then(({ data }) => setSession(data.session)); }} />;

  const navLink = (item: { id: Section; label: string; icon: IconComponent }, mobile = false) => <Link key={item.id} href={`/${item.id}`} className={`nav-link ${section === item.id ? "active" : ""}`} aria-current={section === item.id ? "page" : undefined}><item.icon className="nav-icon" size={15} />{!mobile && item.label}</Link>;
  const headingProps = { section, onCreate: (kind: EditorKind) => { setEditing(null); setEditorKind(kind); }, canWrite, builderOpen, onToggleBuilder: () => { setBuilderOpen((open) => !open); setSelectedSongs([]); } };
  const signOut = () => demoMode ? void demoAuth.signOut() : void supabase?.auth.signOut();
  const accountEmail = session?.user.email ?? demoUser?.email ?? "Workspace user";
  const accountName = session?.user.user_metadata?.full_name ?? accountEmail.split("@")[0];

  return <div className="shell"><aside className="sidebar"><Brand /><button className="workspace-switch"><span className="workspace-avatar">PR</span><span className="workspace-copy"><span className="workspace-title">Pyramid Rights</span><span className="workspace-subtitle">Workspace</span></span><ChevronDown size={13} color="#969c97" /></button><div className="sidebar-nav-scroll"><p className="nav-caption">Workspace</p><nav className="nav-list">{navItems.map((item) => navLink(item))}</nav><p className="nav-caption" style={{ marginTop: 25 }}>Manage</p><nav className="nav-list">{adminItems.map((item) => navLink(item))}</nav></div><div className="sidebar-bottom"><div className="help-card"><CircleHelp size={15} color="#7b8766" /><strong>Need a hand?</strong><p>Learn how rights windows and song eligibility work.</p><Link href="/community" className="help-card-link">Explore community <ArrowRight size={11} /></Link></div><div className="account-row"><span className="account-avatar">{initials(accountEmail)}</span><span className="account-copy"><span className="account-name">{accountName}</span><span className="account-email">{accountEmail}</span></span><button className="icon-button" title="Sign out" onClick={signOut}><LogOut size={14} /></button></div></div></aside>
    <main className="main"><header className="topbar"><div className="mobile-head"><div className="brand-mark"><LayersMark /></div><strong>pyramid</strong></div><div className="breadcrumbs"><span>Workspace</span><ArrowRight size={11} /><strong>{title}</strong></div><div className="topbar-actions"><label className="search-trigger" aria-label="Search workspace"><Search size={13} /><span>Search anything</span><kbd>⌘ K</kbd><input style={{ position: "absolute", opacity: 0, pointerEvents: "none" }} tabIndex={-1} value="" readOnly /></label><NotificationCenter /><button className="top-icon" title="Reload data" onClick={() => window.location.reload()}><RotateCw size={14} /></button><button className="top-icon" title="Sign out" onClick={signOut}><LogOut size={14} /></button></div></header>
      <div className="content"><PageHeading {...headingProps} />{demoMode && <div className="setup-banner"><Sparkles size={15} /><div><strong>Sample preview · no backend connected</strong><p>Illustrative catalogue, CRM, licensing, community, and notification records are included. Changes stay in memory and reset when you refresh.</p></div></div>}{error && <div className="error-banner">{error}</div>}
      {section === "dashboard" && <><ModuleLauncher /><Dashboard counts={dashboardCounts} rows={rows} loading={loading} /></>}
      {section === "catalogue" && !songId && <Catalogue rows={filteredRows} query={query} setQuery={(value) => { setCataloguePage(0); setQuery(value); }} loading={loading} canWrite={canWrite} page={cataloguePage} total={catalogueTotal} onPage={setCataloguePage} onImport={() => setShowImport(true)} onEdit={(row, kind) => { setEditing(row); setEditorKind(kind); }} onDelete={(row) => void deleteRecord("films", row)} onDeleteSong={(row) => void deleteRecord("songs", row)} onAddSong={() => { setEditing(null); setEditorKind("song"); }} />}
      {section === "rights" && <Rights rows={filteredRows} query={query} setQuery={setQuery} statusFilter={statusFilter} setStatusFilter={setStatusFilter} loading={loading} canWrite={canWrite} onEdit={(row) => { setEditing(row); setEditorKind("right"); }} onDelete={(row) => void deleteRecord("rights", row)} />}
      {section === "usage" && <Usage rows={filteredRows} query={query} setQuery={setQuery} loading={loading} canWrite={canWrite} onCorrect={(row) => { const nextDate = window.prompt("Correct the use date (YYYY-MM-DD)", text(row, "added_at").slice(0, 10)); if (nextDate && supabase) void supabase.from("compilation_items").update({ added_at: nextDate } as never).eq("id", text(row, "id")).then(({ error: updateError }) => { if (updateError) setError(updateError.message); else window.location.reload(); }); }} />}
      {section === "compilations" && (builderOpen ? <Builder rows={eligibleRows} loading={loading} territory={territory} setTerritory={setTerritory} territories={territories} selectedSongs={selectedSongs} setSelectedSongs={setSelectedSongs} filters={songFilters} setFilters={setSongFilters} canWrite={canWrite} onSave={() => void saveCompilation()} busy={busy} /> : <Compilations rows={filteredRows} query={query} setQuery={setQuery} loading={loading} onBuild={() => setBuilderOpen(true)} />)}
      {section === "settings" && <Settings rows={rows} form={settingsForm} setForm={setSettingsForm} role={role} busy={busy} onSave={saveSettings} />}
      {section === "team" && <Team rows={filteredRows} query={query} setQuery={setQuery} role={role} loading={loading} onRoleChange={(id, nextRole) => void updateRole(id, nextRole)} />}
      {section === "catalogue-setup" && <CatalogueSetupPage />}
      {section === "licensing" && (packagePreview && requestId ? <BuyerPackagePage requestId={requestId} /> : requestId ? <LicensingRequestPage requestId={requestId} /> : <LicensingInboxPage />)}
      {section === "holds" && <HoldsPage />}
      {section === "deals" && <DealsPage />}
      {section === "renewals" && <RenewalsPage />}
      {section === "clients" && (clientId ? <ClientDetailPage clientId={clientId} /> : <CRMPage />)}
      {section === "community" && (postId ? <CommunityPostPage postId={postId} /> : <CommunityPage />)}
      {section === "insights" && <InsightsPage />}
      {section === "notifications" && <NotificationsPage />}
      {section === "catalogue" && songId && <SongVersionPage songId={songId} />}</div>
      <nav className="mobile-nav">{[...navItems, ...adminItems].map((item) => <Link key={item.id} href={`/${item.id}`} className={section === item.id ? "active" : ""}><item.icon /><span>{item.label === "Rights ledger" ? "Rights" : item.label === "Compilations" ? "Build" : item.label === "Dashboard" ? "Home" : item.label === "Catalogue" ? "Catalog" : item.label === "Team & audit" ? "Team" : item.label === "CRM · Clients" ? "CRM" : item.label}</span></Link>)}</nav>
    </main>{editorKind && <RecordEditor kind={editorKind} initial={editing} films={films} onClose={() => { setEditorKind(null); setEditing(null); }} onSave={(payload) => void saveRecord(payload)} busy={busy} />}{showImport && <ImportModal films={films} onClose={() => setShowImport(false)} onImport={(kind, data) => void doImport(kind, data)} busy={busy} />}{toast && <div className="toast" role="status">{toast}</div>}</div>;
}

function ModuleLauncher() {
  const modules = [
    { href: "/licensing", icon: BriefcaseBusiness, title: "Licensing inbox", detail: "Buyer requests and quotes" },
    { href: "/catalogue-setup", icon: Upload, title: "Import & compare", detail: "Review a sample workbook" },
    { href: "/clients", icon: Users, title: "Client CRM", detail: "Accounts and follow-ups" },
    { href: "/community", icon: MessagesSquare, title: "Community", detail: "Discussions and events" },
    { href: "/insights", icon: TrendingUp, title: "Demand insights", detail: "What buyers are asking for" },
  ];
  return <section className="module-launcher"><div className="module-launcher-heading"><div><p className="eyebrow">Explore Pyramid</p><h2>Go to a workspace</h2></div><span>Sample pages ready to explore</span></div><div className="module-launcher-grid">{modules.map((module) => <Link href={module.href} className="module-launcher-card" key={module.href}><span><module.icon size={15} /></span><strong>{module.title}</strong><small>{module.detail}</small><ArrowRight size={13} /></Link>)}</div></section>;
}

function Dashboard({ counts, rows, loading }: { counts: Record<string, number>; rows: UiRow[]; loading: boolean }) {
  const upcoming = rows.filter((row) => ["expiring_soon", "expired"].includes(text(row, "status"))).slice(0, 6);
  return <><div className="metrics"><MetricCard title="Active rights" value={loading ? "—" : counts.active} note="Current coverage" icon={ShieldCheck} tone="positive" /><MetricCard title="Expiring soon" value={loading ? "—" : counts.expiring} note="Needs a renewal plan" icon={Clock3} tone="warning" /><MetricCard title="Expired rights" value={loading ? "—" : counts.expired} note="Review before reuse" icon={ArrowDownRight} tone="negative" /><MetricCard title="Catalogue" value={loading ? "—" : counts.films + counts.songs} note={`${counts.films} films · ${counts.songs} songs`} icon={Disc3} /></div><div className="dash-grid"><section className="panel"><div className="panel-head"><div><h2 className="panel-title">Rights needing attention</h2><p className="panel-subtitle">The closest expiry dates in your ledger</p></div><Link href="/rights" className="inline-link">Open ledger <ArrowRight size={12} /></Link></div>{upcoming.length ? <div className="table-wrap"><table><thead><tr><th>Film</th><th>Territory</th><th>Expires</th><th>Status</th></tr></thead><tbody>{upcoming.map((row) => <tr key={text(row, "id")}><td><span className="cell-title">{text(row, "film_title")}</span></td><td>{text(row, "territory")}</td><td>{formatDate(text(row, "expiry_date", ""))}</td><td><Status value={text(row, "status")} /></td></tr>)}</tbody></table></div> : <EmptyState icon={ShieldCheck} title={loading ? "Loading the rights ledger…" : "Your rights ledger is clear"} detail={loading ? "Reading the latest rights records from Postgres." : "Add a rights record and Pyramid will calculate its status and expiry date."} action={!loading ? <Link href="/rights" className="button secondary">Open rights ledger</Link> : undefined} />}</section><div style={{ display: "grid", gap: 14 }}><section className="panel"><div className="panel-head"><div><h2 className="panel-title">Your catalogue</h2><p className="panel-subtitle">Shared titles tracked in Pyramid</p></div><Link href="/catalogue" className="inline-link">Browse <ArrowRight size={12} /></Link></div><div className="panel-body"><div className="territory-list"><div className="territory-row"><div className="territory-row-top"><span><Film size={11} style={{ verticalAlign: "-2px", marginRight: 5 }} />Films</span><strong>{counts.films}</strong></div><div className="progress-line"><span style={{ width: counts.films + counts.songs ? `${Math.round(counts.films / (counts.films + counts.songs) * 100)}%` : "0%" }} /></div></div><div className="territory-row"><div className="territory-row-top"><span><Headphones size={11} style={{ verticalAlign: "-2px", marginRight: 5 }} />Songs</span><strong>{counts.songs}</strong></div><div className="progress-line"><span style={{ width: counts.films + counts.songs ? `${Math.round(counts.songs / (counts.films + counts.songs) * 100)}%` : "0%" }} /></div></div><div className="territory-row"><div className="territory-row-top"><span><ListMusic size={11} style={{ verticalAlign: "-2px", marginRight: 5 }} />Compilations</span><strong>{counts.compilations}</strong></div><div className="progress-line"><span style={{ width: Math.min(100, counts.compilations * 8) + "%" }} /></div></div></div></div></section><section className="panel"><div className="panel-head"><div><h2 className="panel-title">Team access</h2><p className="panel-subtitle">Roles keep shared changes clear</p></div><Link href="/team" className="inline-link">Manage <ArrowRight size={12} /></Link></div><div className="panel-body" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}><div className="avatar-stack"><span>AD</span><span>ED</span><span>VW</span></div><span className="muted" style={{ fontSize: 9 }}>Admin · Editor · Viewer</span></div></section></div></div></>;
}

function Catalogue({ rows, query, setQuery, loading, canWrite, page, total, onPage, onImport, onEdit, onDelete, onDeleteSong, onAddSong }: { rows: UiRow[]; query: string; setQuery: (value: string) => void; loading: boolean; canWrite: boolean; page: number; total: number; onPage: (value: number) => void; onImport: () => void; onEdit: (row: UiRow, kind: EditorKind) => void; onDelete: (row: UiRow) => void; onDeleteSong: (row: UiRow) => void; onAddSong: () => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  return <section className="panel"><div className="toolbar"><div className="input-wrap"><Search size={13} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search film titles…" /></div><button className="button secondary" onClick={onImport} disabled={!canWrite}><Upload size={12} />Import workbook</button><span style={{ marginLeft: "auto", color: "#9ba09b", fontSize: 9 }}>{total} films</span></div>{rows.length ? <><div className="table-wrap"><table><thead><tr><th>Film title</th><th>Year</th><th>Language</th><th>Genre</th><th>Songs</th><th>Actions</th></tr></thead><tbody>{rows.map((row) => { const songs = relationList(row, "songs"); const id = text(row, "id"); return <FragmentRow key={id}><tr><td><button className="cell-title" style={{ padding: 0, border: 0, background: "none" }} onClick={() => setExpanded(expanded === id ? null : id)}>{text(row, "title")}</button><span className="cell-subtitle">{text(row, "synopsis", "Film catalogue record")}</span></td><td>{text(row, "release_year")}</td><td>{text(row, "language")}</td><td>{text(row, "genre")}</td><td><span className="status neutral">{songs.length} songs</span></td><td><button className="icon-button" title="Edit film" disabled={!canWrite} onClick={() => onEdit(row, "film")}><Pencil size={12} /></button><button className="icon-button" title="Add song" disabled={!canWrite} onClick={onAddSong}><Plus size={13} /></button><button className="icon-button" title="Delete film" disabled={!canWrite} onClick={() => onDelete(row)}><Trash2 size={12} /></button></td></tr>{expanded === id && <tr><td colSpan={6} style={{ whiteSpace: "normal", background: "#fbfcf9" }}><strong style={{ color: "#4c554b", fontSize: 9 }}>Songs in this film</strong><div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>{songs.length ? songs.map((song) => <div key={text(song, "id")} className="status neutral" style={{ gap: 6 }}><Link className="showcase-song-link" href={`/catalogue/songs/${text(song, "id")}`}>{text(song, "title")} · {text(song, "singer", "Singer not set")}</Link><button title="Edit song" disabled={!canWrite} onClick={() => onEdit(song, "song")}><Pencil size={10} /></button><button title="Delete song" disabled={!canWrite} onClick={() => onDeleteSong(song)}><Trash2 size={10} /></button></div>) : <span className="muted" style={{ fontSize: 9 }}>No songs linked yet.</span>}</div></td></tr>}</FragmentRow>; })}</tbody></table></div><div className="toolbar" style={{ justifyContent: "space-between", borderBottom: 0, borderTop: "1px solid #eff0ed" }}><span className="muted" style={{ fontSize: 9 }}>Showing {page * 25 + 1}–{Math.min(page * 25 + rows.length, total)} of {total}</span><div style={{ display: "flex", gap: 6 }}><button className="button secondary" disabled={page === 0} onClick={() => onPage(page - 1)}>Previous</button><button className="button secondary" disabled={(page + 1) * 25 >= total} onClick={() => onPage(page + 1)}>Next</button></div></div></> : <EmptyState icon={Film} title={loading ? "Loading catalogue…" : "No films in the catalogue yet"} detail={loading ? "Fetching shared records from Postgres." : "Add a film or import rows from your Excel workbook. Songs can be linked to their parent film."} />}</section>;
}

function FragmentRow({ children }: { children: React.ReactNode }) { return <>{children}</>; }

function Rights({ rows, query, setQuery, statusFilter, setStatusFilter, loading, canWrite, onEdit, onDelete }: { rows: UiRow[]; query: string; setQuery: (value: string) => void; statusFilter: string; setStatusFilter: (value: string) => void; loading: boolean; canWrite: boolean; onEdit: (row: UiRow) => void; onDelete: (row: UiRow) => void }) {
  return <section className="panel"><div className="toolbar"><div className="input-wrap"><Search size={13} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search film, owner, territory…" /></div><select className="select" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="all">All statuses</option><option value="active">Active</option><option value="expiring_soon">Expiring soon</option><option value="within_30">Expires in 30 days</option><option value="within_60">Expires in 60 days</option><option value="within_90">Expires in 90 days</option><option value="expired">Expired</option><option value="perpetual">Perpetual</option></select><span style={{ marginLeft: "auto", color: "#9ba09b", fontSize: 9 }}>{rows.length} records</span></div>{rows.length ? <div className="table-wrap"><table><thead><tr><th>Film</th><th>Owner</th><th>Territory</th><th>Start date</th><th>License period</th><th>Expiry date</th><th>Status</th><th>Actions</th></tr></thead><tbody>{rows.map((row) => <tr key={text(row, "id")}><td><span className="cell-title">{text(row, "film_title")}</span></td><td>{text(row, "owner")}</td><td>{text(row, "territory")}</td><td>{formatDate(text(row, "start_date", ""))}</td><td>{text(row, "is_perpetual") === "true" ? "Perpetual" : `${text(row, "license_period_months")} months`}</td><td>{formatDate(text(row, "expiry_date", ""))}</td><td><Status value={text(row, "status")} /></td><td><button className="icon-button" title="Edit rights" disabled={!canWrite} onClick={() => onEdit(row)}><Pencil size={12} /></button><button className="icon-button" title="Delete rights" disabled={!canWrite} onClick={() => onDelete(row)}><Trash2 size={12} /></button></td></tr>)}</tbody></table></div> : <EmptyState icon={ShieldCheck} title={loading ? "Loading rights…" : "No rights records yet"} detail={loading ? "Status and expiry are computed by the database." : "Add rights with a territory and date range. Status and expiry are calculated automatically from your workspace policy."} />}</section>;
}

function Usage({ rows, query, setQuery, loading, canWrite, onCorrect }: { rows: UiRow[]; query: string; setQuery: (value: string) => void; loading: boolean; canWrite: boolean; onCorrect: (row: UiRow) => void }) {
  return <section className="panel"><div className="toolbar"><div className="input-wrap"><Search size={13} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search song or compilation…" /></div><span style={{ marginLeft: "auto", color: "#9ba09b", fontSize: 9 }}>{rows.length} song uses</span></div>{rows.length ? <div className="table-wrap"><table><thead><tr><th>Song</th><th>Singer</th><th>Compilation</th><th>Territory</th><th>Used on</th><th>Action</th></tr></thead><tbody>{rows.map((row) => { const song = relation(row, "songs"); const compilation = relation(row, "compilations"); return <tr key={text(row, "id")}><td><span className="cell-title">{text(song, "title")}</span></td><td>{text(song, "singer")}</td><td>{text(compilation, "name")}</td><td>{text(compilation, "territory")}</td><td>{formatDate(text(row, "added_at", ""))}</td><td><button className="icon-button" title="Correct usage date" disabled={!canWrite} onClick={() => onCorrect(row)}><Pencil size={12} /></button></td></tr>; })}</tbody></table></div> : <EmptyState icon={AudioLines} title={loading ? "Loading usage log…" : "No song usage recorded"} detail={loading ? "Reading compilation items from Postgres." : "When your team saves a compilation, each song placement is recorded here."} />}</section>;
}

function Compilations({ rows, query, setQuery, loading, onBuild }: { rows: UiRow[]; query: string; setQuery: (value: string) => void; loading: boolean; onBuild: () => void }) {
  return <section className="panel"><div className="toolbar"><div className="input-wrap"><Search size={13} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search compilations…" /></div><button className="button secondary" onClick={onBuild}><Sparkles size={12} />Open builder</button><span style={{ marginLeft: "auto", color: "#9ba09b", fontSize: 9 }}>{rows.length} compilations</span></div>{rows.length ? <div className="table-wrap"><table><thead><tr><th>Compilation</th><th>Territory</th><th>Songs</th><th>Created</th></tr></thead><tbody>{rows.map((row) => { const items = relationList(row, "compilation_items"); return <tr key={text(row, "id")}><td><span className="cell-title">{text(row, "name")}</span></td><td>{text(row, "territory")}</td><td>{items.length}</td><td>{formatDate(text(row, "created_at", ""))}</td></tr>; })}</tbody></table></div> : <EmptyState icon={ListMusic} title={loading ? "Loading compilations…" : "No compilations yet"} detail={loading ? "Fetching compilation history." : "Use the builder to find songs with current rights in a territory and outside the reuse cooldown."} action={<button className="button secondary" onClick={onBuild}>Build a compilation</button>} />}</section>;
}

function Builder({ rows, loading, territory, setTerritory, territories, selectedSongs, setSelectedSongs, filters, setFilters, canWrite, onSave, busy }: { rows: UiRow[]; loading: boolean; territory: string; setTerritory: (value: string) => void; territories: string[]; selectedSongs: string[]; setSelectedSongs: (value: string[]) => void; filters: { genre: string; singer: string; language: string; year: string }; setFilters: (value: { genre: string; singer: string; language: string; year: string }) => void; canWrite: boolean; onSave: () => void; busy: boolean }) {
  const toggle = (id: string) => setSelectedSongs(selectedSongs.includes(id) ? selectedSongs.filter((item) => item !== id) : [...selectedSongs, id]);
  const expiringSelection = rows.filter((row) => selectedSongs.includes(text(row, "song_id")) && text(row, "rights_status") === "expiring_soon");
  return <><section className="panel"><div className="toolbar"><label style={{ color: "#767d78", fontSize: 9, fontWeight: 600 }}>Territory</label><select className="select" value={territory} onChange={(event) => setTerritory(event.target.value)}><option value="">Choose territory</option>{territories.map((place) => <option key={place}>{place}</option>)}</select><div className="input-wrap"><Filter size={12} /><input placeholder="Genre" value={filters.genre} onChange={(event) => setFilters({ ...filters, genre: event.target.value })} /></div><div className="input-wrap"><input placeholder="Singer" value={filters.singer} onChange={(event) => setFilters({ ...filters, singer: event.target.value })} /></div><div className="input-wrap"><input placeholder="Language" value={filters.language} onChange={(event) => setFilters({ ...filters, language: event.target.value })} /></div><div className="input-wrap" style={{ minWidth: 90, flex: "0 0 90px" }}><input placeholder="Year" value={filters.year} onChange={(event) => setFilters({ ...filters, year: event.target.value })} /></div></div>{rows.length ? <div className="table-wrap"><table><thead><tr><th></th><th>Song</th><th>Film</th><th>Singer</th><th>Genre</th><th>Last used</th><th>Clearance</th><th>Eligibility</th></tr></thead><tbody>{rows.map((row) => { const id = text(row, "song_id"); const eligible = row.eligible === true; return <tr key={`${id}-${text(row, "territory")}`}><td className="checkbox-cell"><input type="checkbox" disabled={!eligible || !canWrite} checked={selectedSongs.includes(id)} onChange={() => toggle(id)} aria-label={`Select ${text(row, "song_title")}`} /></td><td><span className="cell-title">{text(row, "song_title")}</span></td><td>{text(row, "film_title")}</td><td>{text(row, "singer")}</td><td>{text(row, "genre")}</td><td>{formatDate(text(row, "last_used_at", ""))}</td><td>{row.rights_status ? <Status value={text(row, "rights_status")} /> : <span className="status neutral">No record</span>}</td><td><span className={`status ${eligible ? "active" : "expired"}`}>{eligible ? "Eligible" : text(row, "reason", "Not eligible")}</span></td></tr>; })}</tbody></table></div> : <EmptyState icon={Sparkles} title={loading ? "Checking song rights…" : "No matching songs"} detail={loading ? "Eligibility is checked against the rights ledger and reuse policy in Postgres." : territories.length ? "Try another territory or broaden your filters. Songs with no active rights or a recent use include the reason here." : "Add rights records with territories before building a compilation."} />}</section>{selectedSongs.length > 0 && <div className="builder-summary"><div><strong>{selectedSongs.length} songs selected</strong><span>{expiringSelection.length ? `${expiringSelection.length} selected song${expiringSelection.length === 1 ? " has" : "s have"} rights expiring soon. Review expiry dates before release.` : "Postgres rechecks eligibility at save time."}</span></div><button className="button lime" disabled={busy || !canWrite} onClick={onSave}><Check size={13} />{busy ? "Saving…" : "Save compilation"}</button></div>}</>;
}

function Settings({ rows, form, setForm, role, busy, onSave }: { rows: UiRow[]; form: { expiring_soon_days: string; song_reuse_cooldown_days: string }; setForm: (value: { expiring_soon_days: string; song_reuse_cooldown_days: string }) => void; role: ProfileRole; busy: boolean; onSave: (event: React.FormEvent<HTMLFormElement>) => void }) {
  return <div className="dash-grid"><section className="panel"><div className="panel-head"><div><h2 className="panel-title">Rights & reuse policy</h2><p className="panel-subtitle">Changes apply to the whole workspace</p></div><Settings2 size={15} color="#78816d" /></div><form className="panel-body" onSubmit={onSave}><div className="form-grid"><div className="form-field"><label htmlFor="expiring">Expiring soon window</label><input id="expiring" type="number" min="1" max="3650" value={form.expiring_soon_days} onChange={(event) => setForm({ ...form, expiring_soon_days: event.target.value })} disabled={role !== "admin"} /><span className="muted" style={{ fontSize: 9 }}>Rights expiring within this many days are flagged.</span></div><div className="form-field"><label htmlFor="cooldown">Song reuse cooldown</label><input id="cooldown" type="number" min="0" max="3650" value={form.song_reuse_cooldown_days} onChange={(event) => setForm({ ...form, song_reuse_cooldown_days: event.target.value })} disabled={role !== "admin"} /><span className="muted" style={{ fontSize: 9 }}>Songs remain unavailable this long after use.</span></div></div><div className="modal-actions"><button className="button" disabled={busy || role !== "admin"}>{busy ? "Saving…" : "Save workspace settings"}</button></div></form></section><section className="panel"><div className="panel-head"><div><h2 className="panel-title">Computed rights status</h2><p className="panel-subtitle">Status comes from dates and these settings</p></div><Clock3 size={15} color="#78816d" /></div><div className="panel-body" style={{ display: "grid", gap: 12 }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span className="muted" style={{ fontSize: 10 }}>Default expiring window</span><strong style={{ fontSize: 11 }}>{text(rows[0], "expiring_soon_days", "90")} days</strong></div><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span className="muted" style={{ fontSize: 10 }}>Default song cooldown</span><strong style={{ fontSize: 11 }}>{text(rows[0], "song_reuse_cooldown_days", "180")} days</strong></div><p className="muted" style={{ margin: 0, fontSize: 9, lineHeight: 1.6 }}>Expiry dates and status are derived in the database view. Perpetual rights have no expiry date.</p></div></section></div>;
}

function Team({ rows, query, setQuery, role, loading, onRoleChange }: { rows: UiRow[]; query: string; setQuery: (value: string) => void; role: ProfileRole; loading: boolean; onRoleChange: (id: string, role: ProfileRole) => void }) {
  return <><section className="panel"><div className="panel-head"><div><h2 className="panel-title">Workspace members</h2><p className="panel-subtitle">Admin invites are managed through Supabase Auth. Update existing access below.</p></div><span className="status neutral">{role}</span></div><div className="toolbar"><div className="input-wrap"><Search size={13} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search team…" /></div><span style={{ marginLeft: "auto", color: "#9ba09b", fontSize: 9 }}>{rows.length} members</span></div>{rows.length ? <div className="table-wrap"><table><thead><tr><th>Member</th><th>Role</th><th>Joined</th><th>Access</th></tr></thead><tbody>{rows.map((row) => <tr key={text(row, "id")}><td><div style={{ display: "flex", alignItems: "center", gap: 8 }}><span className="account-avatar" style={{ width: 25, height: 25 }}>{initials(text(row, "email"))}</span><span className="cell-title">{text(row, "email")}</span></div></td><td><Status value={text(row, "role")} /></td><td>{formatDate(text(row, "created_at", ""))}</td><td><select className="role-select" value={text(row, "role", "viewer")} disabled={role !== "admin" || loading} onChange={(event) => onRoleChange(text(row, "id"), event.target.value as ProfileRole)}><option value="admin">Admin</option><option value="editor">Editor</option><option value="viewer">Viewer</option></select></td></tr>)}</tbody></table></div> : <EmptyState icon={Users} title={loading ? "Loading team…" : "No workspace profiles"} detail={loading ? "Reading roles from Postgres." : "Supabase Auth users need a profile row before they appear here."} />}</section><section className="panel" style={{ marginTop: 14 }}><div className="panel-head"><div><h2 className="panel-title">Audit trail</h2><p className="panel-subtitle">Rights, usage, and settings changes are written by database triggers</p></div><Activity size={15} color="#78816d" /></div><AuditTable /></section></>;
}

function AuditTable() {
  const supabase = getSupabase();
  const [rows, setRows] = useState<UiRow[]>([]);
  const [error, setError] = useState("");
  useEffect(() => { if (!supabase) return; let ignore = false; void supabase.from("audit_log").select("*").order("changed_at", { ascending: false }).limit(30).then(({ data, error: readError }) => { if (ignore) return; if (readError) setError(readError.message); setRows((data ?? []) as unknown as UiRow[]); }); return () => { ignore = true; }; }, [supabase]);
  if (error) return <div className="panel-body"><p className="muted" style={{ fontSize: 10 }}>Audit history is available to admins and editors. {error}</p></div>;
  return rows.length ? <div className="table-wrap"><table><thead><tr><th>Change</th><th>Table</th><th>Record</th><th>When</th></tr></thead><tbody>{rows.map((row) => <tr key={text(row, "id")}><td><span className="cell-title">{text(row, "action")}</span></td><td>{text(row, "table_name")}</td><td>{text(row, "record_id").slice(0, 10)}</td><td>{formatDate(text(row, "changed_at", ""))}</td></tr>)}</tbody></table></div> : <div className="panel-body"><span className="muted" style={{ fontSize: 10 }}>No audited changes yet.</span></div>;
}
