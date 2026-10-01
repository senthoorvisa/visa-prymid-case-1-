"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, BriefcaseBusiness, Building2, CalendarDays, CircleDollarSign, Mail, MapPin, Plus, Search, Users, X } from "lucide-react";
import { demoRequests, type DemoClient } from "@/lib/showcase-data";
import { DemoDataNotice, InitialAvatar, MetricTiles, PanelTitle, ToneTag } from "@/components/showcase-ui";
import { useShowcase } from "@/components/showcase-provider";

type CRMTab = "Accounts" | "Contacts" | "Pipeline";

export function CRMPage() {
  const { clients, addClient: addSampleClient } = useShowcase();
  const [tab, setTab] = useState<CRMTab>("Accounts");
  const [query, setQuery] = useState("");
  const [showNewClient, setShowNewClient] = useState(false);
  const [newClient, setNewClient] = useState({ name: "", contact: "", email: "", region: "" });
  const filtered = useMemo(() => clients.filter((client) => `${client.name} ${client.primaryContact} ${client.region} ${client.type}`.toLowerCase().includes(query.toLowerCase())), [clients, query]);
  const openRequestCount = demoRequests.filter((request) => request.status === "Received" || request.status === "Reviewing").length;
  const pipelineValue = "₹28.4L";

  const addClient = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const id = `demo-${Date.now()}`;
    const client: DemoClient = { id, name: newClient.name, type: "New prospect", region: newClient.region || "Region not added", website: "Not added", status: "Prospect", primaryContact: newClient.contact, title: "Primary contact", email: newClient.email, phone: "Not added", lastContact: "Just added", relationshipOwner: "Workspace user", tags: ["New prospect"], notes: "Added to this preview only. This record resets when the page refreshes.", requests: [] };
    addSampleClient(client);
    setNewClient({ name: "", contact: "", email: "", region: "" });
    setShowNewClient(false);
  };

  return <div className="showcase-stack">
    <DemoDataNotice>Sample CRM workspace · records and new entries live in page memory only.</DemoDataNotice>
    <MetricTiles items={[
      { label: "Client accounts", value: clients.length, note: "5 sample organizations", icon: <Building2 size={14} />, tone: "good" },
      { label: "Open requests", value: openRequestCount, note: "Received or in review", icon: <BriefcaseBusiness size={14} />, tone: "warning" },
      { label: "Active contacts", value: clients.length + 4, note: "Buyer and rights-team contacts", icon: <Users size={14} /> },
      { label: "Pipeline value", value: pipelineValue, note: "Illustrative quote totals", icon: <CircleDollarSign size={14} />, tone: "good" },
    ]} />
    <section className="showcase-panel">
      <PanelTitle title="Client relationship workspace" detail="Keep organizations, people, licensing requests, and follow-ups together." action={<button className="button" type="button" onClick={() => setShowNewClient(true)}><Plus size={13} />Add client</button>} />
      <div className="showcase-toolbar"><div className="input-wrap"><Search size={13} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search clients or contacts…" /></div><div className="showcase-tabs compact" role="tablist" aria-label="CRM views">{(["Accounts", "Contacts", "Pipeline"] as CRMTab[]).map((item) => <button type="button" role="tab" aria-selected={tab === item} className={tab === item ? "active" : ""} key={item} onClick={() => setTab(item)}>{item}</button>)}</div></div>
      {tab === "Accounts" && <div className="crm-account-list">{filtered.map((client) => {
        const openRequests = demoRequests.filter((request) => request.clientId === client.id).length;
        return <Link href={`/clients/${client.id}`} className="crm-account-row" key={client.id}>
          <InitialAvatar name={client.name} />
          <span className="crm-account-main"><strong>{client.name}</strong><small>{client.type} · {client.region}</small></span>
          <span className="crm-account-contact"><b>{client.primaryContact}</b><small>{client.title}</small></span>
          <span className="crm-account-request">{openRequests}<small>requests</small></span>
          <ToneTag tone={client.status === "Active" || client.status === "Client" ? "good" : "neutral"}>{client.status}</ToneTag>
          <ArrowRight size={14} className="crm-row-arrow" />
        </Link>;
      })}{!filtered.length && <div className="notification-empty"><strong>No matching accounts</strong><span>Try a different client or contact name.</span></div>}</div>}
      {tab === "Contacts" && <div className="table-wrap"><table><thead><tr><th>Contact</th><th>Organization</th><th>Email</th><th>Last touch</th><th>Owner</th></tr></thead><tbody>{filtered.map((client) => <tr key={client.id}><td><Link href={`/clients/${client.id}`} className="crm-contact-cell"><InitialAvatar name={client.primaryContact} tone="blue" /><span><strong>{client.primaryContact}</strong><small>{client.title}</small></span></Link></td><td>{client.name}</td><td><a className="inline-link" href={`mailto:${client.email}`}><Mail size={12} />{client.email}</a></td><td>{client.lastContact}</td><td>{client.relationshipOwner}</td></tr>)}</tbody></table></div>}
      {tab === "Pipeline" && <div className="crm-pipeline-grid">{(["Received", "Reviewing", "Quoted", "Approved"] as const).map((stage) => {
        const requests = demoRequests.filter((request) => request.status === stage);
        return <section className="crm-stage" key={stage}><div className="crm-stage-heading"><strong>{stage}</strong><span>{requests.length}</span></div>{requests.map((request) => <Link key={request.id} className="crm-opportunity-card" href={`/licensing/${request.id}`}><small>{request.client}</small><strong>{request.title}</strong><span>{request.budget}</span><i>{request.owner}</i></Link>)}{!requests.length && <p className="muted" style={{ fontSize: 10 }}>No sample cases</p>}</section>;
      })}</div>}
    </section>
    <div className="showcase-two-col"><section className="showcase-panel"><PanelTitle title="Follow-up queue" detail="Suggested next steps from the sample workspace." /><div className="crm-followup-list"><Link href="/licensing/req-lotus-youtube"><span className="crm-followup-date">Today</span><span><strong>Send rights clarification to Lotus Pictures</strong><small>Confirm the publishing share before the quote is finalized.</small></span><ArrowRight size={13} /></Link><Link href="/clients/sunbird-creative"><span className="crm-followup-date">Oct 2</span><span><strong>Ask Sunbird about instrumental edits</strong><small>They requested a 30-second digital campaign track.</small></span><ArrowRight size={13} /></Link><Link href="/clients/riverstone-films"><span className="crm-followup-date">Oct 5</span><span><strong>Schedule a catalogue introduction</strong><small>New prospect referral from the community.</small></span><ArrowRight size={13} /></Link></div></section><section className="showcase-panel crm-tip-panel"><span className="showcase-metric-icon"><CalendarDays size={15} /></span><h2>Relationship context</h2><p>Connect client details to request history so the team can see prior conversations before preparing the next shortlist.</p><Link href="/licensing" className="inline-link">Open request inbox <ArrowRight size={12} /></Link></section></div>
    {showNewClient && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowNewClient(false); }}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="new-client-title"><div className="modal-head"><div><h2 id="new-client-title">Add a sample client</h2><p>This entry is temporary and resets when the page refreshes.</p></div><button className="icon-button" type="button" aria-label="Close" onClick={() => setShowNewClient(false)}><X size={15} /></button></div><form onSubmit={addClient}><div className="form-grid"><div className="form-field"><label htmlFor="client-name">Organization</label><input id="client-name" required value={newClient.name} onChange={(event) => setNewClient({ ...newClient, name: event.target.value })} /></div><div className="form-field"><label htmlFor="client-region">Region</label><input id="client-region" value={newClient.region} onChange={(event) => setNewClient({ ...newClient, region: event.target.value })} /></div><div className="form-field"><label htmlFor="client-contact">Primary contact</label><input id="client-contact" required value={newClient.contact} onChange={(event) => setNewClient({ ...newClient, contact: event.target.value })} /></div><div className="form-field"><label htmlFor="client-email">Email</label><input id="client-email" type="email" required value={newClient.email} onChange={(event) => setNewClient({ ...newClient, email: event.target.value })} /></div></div><div className="modal-actions"><button className="button secondary" type="button" onClick={() => setShowNewClient(false)}>Cancel</button><button className="button"><Plus size={13} />Add to preview</button></div></form></section></div>}
  </div>;
}

export function ClientDetailPage({ clientId }: { clientId: string }) {
  const { clients } = useShowcase();
  const client = clients.find((item) => item.id === clientId);
  const [tab, setTab] = useState("Overview");
  if (!client) return <section className="showcase-panel"><p>That sample client could not be found.</p><Link className="button secondary" href="/clients"><ArrowLeft size={13} />Back to CRM</Link></section>;
  const requests = demoRequests.filter((request) => request.clientId === client.id);

  return <div className="showcase-stack">
    <DemoDataNotice>Sample CRM profile · the information below is illustrative only.</DemoDataNotice>
    <section className="showcase-panel crm-profile-hero"><Link href="/clients" className="inline-link"><ArrowLeft size={12} />All clients</Link><div className="crm-profile-main"><InitialAvatar name={client.name} tone="lavender" /><div><div className="crm-profile-title"><h2>{client.name}</h2><ToneTag tone={client.status === "Prospect" ? "warning" : "good"}>{client.status}</ToneTag></div><p>{client.type} · {client.region}</p><span className="crm-profile-website">{client.website}</span></div><Link href="/licensing" className="button secondary">New request <ArrowRight size={13} /></Link></div><div className="crm-profile-facts"><span><b>Relationship owner</b>{client.relationshipOwner}</span><span><b>Last contact</b>{client.lastContact}</span><span><b>Open requests</b>{requests.length}</span><span><b>Tags</b>{client.tags.join(" · ")}</span></div></section>
    <div className="showcase-tabs" role="tablist" aria-label="Client details">{["Overview", "Contacts", "Opportunities", "Activity"].map((item) => <button type="button" role="tab" aria-selected={tab === item} className={tab === item ? "active" : ""} key={item} onClick={() => setTab(item)}>{item}</button>)}</div>
    {tab === "Overview" && <div className="showcase-two-col"><section className="showcase-panel"><PanelTitle title="Account notes" detail="Shared context for the rights and licensing team." /><div className="crm-note-body"><p>{client.notes}</p><div className="crm-note-author"><InitialAvatar name={client.relationshipOwner} tone="peach" /><span><strong>{client.relationshipOwner}</strong><small>Relationship owner · sample note</small></span><time>Today</time></div></div></section><section className="showcase-panel"><PanelTitle title="Primary contact" /><div className="crm-contact-card"><InitialAvatar name={client.primaryContact} tone="blue" /><div><strong>{client.primaryContact}</strong><small>{client.title}</small><a href={`mailto:${client.email}`}><Mail size={12} />{client.email}</a><span><MapPin size={12} />{client.region}</span></div></div></section></div>}
    {tab === "Contacts" && <section className="showcase-panel"><PanelTitle title="People at this account" detail="Contact details shown in this sample profile." /><div className="table-wrap"><table><thead><tr><th>Name</th><th>Role</th><th>Email</th><th>Region</th></tr></thead><tbody><tr><td>{client.primaryContact}</td><td>{client.title}</td><td><a className="inline-link" href={`mailto:${client.email}`}>{client.email}</a></td><td>{client.region}</td></tr><tr><td>{client.relationshipOwner}</td><td>Pyramid account owner</td><td><a className="inline-link" href="mailto:team@pyramid.demo">team@pyramid.demo</a></td><td>Chennai, India</td></tr></tbody></table></div></section>}
    {tab === "Opportunities" && <section className="showcase-panel"><PanelTitle title="Licensing opportunities" detail="Requests linked to this account." />{requests.length ? <div className="crm-account-list">{requests.map((request) => <Link href={`/licensing/${request.id}`} className="crm-account-row" key={request.id}><span className="crm-opportunity-icon"><BriefcaseBusiness size={15} /></span><span className="crm-account-main"><strong>{request.title}</strong><small>{request.campaign} · deadline {request.deadline}</small></span><span className="crm-account-request">{request.budget}<small>budget range</small></span><ToneTag tone={request.status === "Quoted" || request.status === "Approved" ? "good" : "warning"}>{request.status}</ToneTag><ArrowRight size={14} /></Link>)}</div> : <div className="notification-empty"><strong>No linked opportunities yet</strong><Link href="/licensing" className="inline-link">Open request inbox <ArrowRight size={12} /></Link></div>}</section>}
    {tab === "Activity" && <section className="showcase-panel"><PanelTitle title="Recent account activity" detail="A concise timeline of sample interactions." /><div className="crm-timeline"><article><span className="crm-timeline-dot" /><time>Today · 10:24 AM</time><strong>Licensing brief received</strong><p>{requests[0]?.title ?? "Account profile reviewed"}</p></article><article><span className="crm-timeline-dot blue" /><time>Yesterday · 4:10 PM</time><strong>Shortlist discussion</strong><p>Team noted territory, platform, and term details for follow-up.</p></article><article><span className="crm-timeline-dot gold" /><time>Sep 25 · 11:30 AM</time><strong>Relationship note added</strong><p>Preference and account context were summarized for the team.</p></article></div></section>}
  </div>;
}
