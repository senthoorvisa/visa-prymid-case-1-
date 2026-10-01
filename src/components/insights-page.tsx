import Link from "next/link";
import { ArrowRight, BarChart3, CircleDollarSign, Music2, Search, TrendingDown, TrendingUp } from "lucide-react";
import { demoChart, demoRequests } from "@/lib/showcase-data";
import { DemoDataNotice, MetricTiles, PanelTitle, ToneTag } from "@/components/showcase-ui";

const demandRows = [
  { song: "Vaanam Thodum", film: "Neela Mazhai", asked: 7, status: "Shortlisted 4 times", signal: "High interest", tone: "good", request: "req-lotus-youtube" },
  { song: "Nila Kaayum", film: "Nila Vaasal", asked: 5, status: "Quoted 2 times", signal: "Moving forward", tone: "blue", request: "req-bluepeacock-drama" },
  { song: "Pudhu Paadhai", film: "Veedu Vaanam", asked: 4, status: "Unavailable in 2 briefs", signal: "Rights gap", tone: "warning", request: "req-lotus-youtube" },
  { song: "Quiet Shore (Instrumental)", film: "The Blue Shore", asked: 3, status: "Shortlisted 2 times", signal: "Version demand", tone: "purple", request: "req-sunbird-travel" },
];

export function InsightsPage() {
  const maxValue = Math.max(...demoChart.map((item) => item.requests));
  return <div className="showcase-stack"><DemoDataNotice>Illustrative demand metrics · interest is a signal, not a forecast or guaranteed revenue.</DemoDataNotice><MetricTiles items={[
    { label: "Requests this month", value: 16, note: "+18% vs. previous month", icon: <Search size={14} />, tone: "good" },
    { label: "Shortlisted", value: 38, note: "Across active cases", icon: <Music2 size={14} /> },
    { label: "Quoted", value: 14, note: "Quote activity in sample", icon: <CircleDollarSign size={14} />, tone: "good" },
    { label: "Unavailable matches", value: 6, note: "Review rights or metadata gaps", icon: <TrendingDown size={14} />, tone: "warning" },
  ]} />
    <div className="showcase-two-col insights-grid"><section className="showcase-panel"><PanelTitle title="Request activity" detail="Monthly requests and quotes · sample trend" action={<ToneTag tone="good"><TrendingUp size={11} />Interest rising</ToneTag>} /><div className="insights-chart-legend"><span><i />Requests</span><span><i className="quoted" />Quoted</span></div><div className="insights-chart">{demoChart.map((item) => <div className="insights-bar-group" key={item.label}><div className="insights-bars"><span className="bar requests" style={{ height: `${Math.max(8, item.requests / maxValue * 100)}%` }} title={`${item.requests} requests`} /><span className="bar quoted" style={{ height: `${Math.max(8, item.quoted / maxValue * 100)}%` }} title={`${item.quoted} quoted`} /></div><small>{item.label}</small></div>)}</div><div className="insights-chart-foot"><span>6 month view</span><span>Quote rate is descriptive, not a revenue forecast</span></div></section>
      <section className="showcase-panel"><PanelTitle title="Where interest is landing" detail="Signals from recent sample requests." /><div className="insights-signal-list"><article><span className="insights-signal-icon">TN</span><div><strong>Tamil campaign music</strong><small>8 request mentions · 5 shortlists</small></div><ToneTag tone="good">Growing</ToneTag></article><article><span className="insights-signal-icon blue">IN</span><div><strong>Instrumental versions</strong><small>6 request mentions · 4 briefs</small></div><ToneTag tone="blue">Opportunity</ToneTag></article><article><span className="insights-signal-icon gold">RG</span><div><strong>Regional promo scope</strong><small>4 requests need a rights clarification</small></div><ToneTag tone="warning">Review</ToneTag></article></div><Link href="/licensing" className="inline-link">View request inbox <ArrowRight size={12} /></Link></section></div>
    <section className="showcase-panel"><PanelTitle title="Song demand & missed opportunities" detail="See what was asked for, how far it progressed, and why a match may not have moved forward." /><div className="table-wrap"><table><thead><tr><th>Song</th><th>Requests</th><th>Pipeline signal</th><th>Availability signal</th><th>Next step</th></tr></thead><tbody>{demandRows.map((row) => <tr key={row.song}><td><strong>{row.song}</strong><small className="table-subtext">{row.film}</small></td><td>{row.asked}</td><td>{row.status}</td><td><ToneTag tone={row.tone as "good" | "warning" | "purple" | "blue"}>{row.signal}</ToneTag></td><td><Link href={`/licensing/${row.request}`} className="inline-link">Open related case <ArrowRight size={12} /></Link></td></tr>)}</tbody></table></div><div className="insights-disclaimer"><BarChart3 size={13} /><span>Repeated requests and unavailable tracks can inform catalogue planning. They do not guarantee future sales.</span></div></section>
    <section className="insights-funnel"><div><strong>Request journey</strong><span>Sample cases move from demand signal to a recorded outcome.</span></div>{["Received", "Reviewing", "Quoted", "Approved"].map((stage) => <Link href="/licensing" key={stage}><b>{demoRequests.filter((request) => request.status === stage).length}</b><small>{stage}</small></Link>)}</section>
  </div>;
}
