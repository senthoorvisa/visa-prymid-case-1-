export type ShowcaseRow = Record<string, unknown>;

export type DemoClient = {
  id: string;
  name: string;
  type: string;
  region: string;
  website: string;
  status: string;
  primaryContact: string;
  title: string;
  email: string;
  phone: string;
  lastContact: string;
  relationshipOwner: string;
  tags: string[];
  notes: string;
  requests: string[];
};

export type DemoRequest = {
  id: string;
  clientId: string;
  client: string;
  title: string;
  brief: string;
  campaign: string;
  use: string;
  platform: string;
  territory: string;
  startDate: string;
  endDate: string;
  deadline: string;
  budget: string;
  owner: string;
  status: "Received" | "Reviewing" | "Quoted" | "Approved";
  requestedStyle: string;
  songs: { title: string; film: string; fit: string; recording: string; composition: string; note: string }[];
};

export type DemoNotification = {
  id: string;
  kind: "Suggestion" | "Update" | "Community";
  title: string;
  detail: string;
  age: string;
  href: string;
  unread: boolean;
};

export type DemoCommunityPost = {
  id: string;
  author: string;
  role: string;
  initials: string;
  category: string;
  time: string;
  title: string;
  body: string;
  tags: string[];
  likes: number;
  replies: number;
};

export type DemoCommunityReply = { author: string; initials: string; time: string; body: string };

export const demoClients: DemoClient[] = [
  {
    id: "lotus-pictures", name: "Lotus Pictures", type: "Production company", region: "Chennai, India", website: "lotuspictures.example", status: "Active", primaryContact: "Meena Sundaram", title: "Music Supervisor", email: "meena@lotuspictures.example", phone: "+91 44 5550 0182", lastContact: "Today, 10:24 AM", relationshipOwner: "Priya Nair", tags: ["Tamil", "Film", "High potential"], notes: "Prefers clear territory summaries and a concise shortlist. Current brief is for a six-week YouTube campaign.", requests: ["req-lotus-youtube", "req-lotus-series"],
  },
  {
    id: "sunbird-creative", name: "Sunbird Creative", type: "Creative agency", region: "Mumbai, India", website: "sunbirdcreative.example", status: "Prospect", primaryContact: "Arjun Mehta", title: "Executive Producer", email: "arjun@sunbirdcreative.example", phone: "+91 22 5550 0147", lastContact: "Yesterday", relationshipOwner: "Kavya Raman", tags: ["Advertising", "Hindi", "Prospect"], notes: "Exploring music options for a national travel campaign. Asked for instrumental versions.", requests: ["req-sunbird-travel"],
  },
  {
    id: "blue-peacock-broadcast", name: "Blue Peacock Broadcast", type: "Broadcaster", region: "Bengaluru, India", website: "bluepeacock.example", status: "Client", primaryContact: "Ananya Rao", title: "Content Acquisitions", email: "ananya@bluepeacock.example", phone: "+91 80 5550 0211", lastContact: "Sep 28, 2026", relationshipOwner: "Priya Nair", tags: ["Broadcast", "South India", "Repeat client"], notes: "Annual catalogue review scheduled. Their team often needs language and performer metadata up front.", requests: ["req-bluepeacock-drama"],
  },
  {
    id: "mango-tree-media", name: "Mango Tree Media", type: "Digital studio", region: "Singapore", website: "mangotreemedia.example", status: "Active", primaryContact: "Leela Iyer", title: "Campaign Lead", email: "leela@mangotreemedia.example", phone: "+65 5550 0126", lastContact: "Sep 26, 2026", relationshipOwner: "Kavya Raman", tags: ["Digital", "Tamil", "International"], notes: "Planning a regional launch. Confirm the specific media, term, and territory before preparing a quote.", requests: ["req-mango-launch"],
  },
  {
    id: "riverstone-films", name: "Riverstone Films", type: "Independent producer", region: "Kochi, India", website: "riverstonefilms.example", status: "Prospect", primaryContact: "Nikhil Varma", title: "Producer", email: "nikhil@riverstonefilms.example", phone: "+91 484 5550 0194", lastContact: "Sep 22, 2026", relationshipOwner: "Priya Nair", tags: ["Film", "Malayalam", "New lead"], notes: "Introduced by a composer in the community. Asked for a catalogue overview and a call next week.", requests: [],
  },
];

export const demoRequests: DemoRequest[] = [
  {
    id: "req-lotus-youtube", clientId: "lotus-pictures", client: "Lotus Pictures", title: "Tamil songs for a YouTube campaign", brief: "Warm, contemporary Tamil tracks for a family travel campaign. The buyer prefers a recognizable vocal hook and needs both the recording and composition rights reviewed.", campaign: "Monsoon Routes", use: "Online advertising", platform: "YouTube, Instagram", territory: "India", startDate: "2026-10-20", endDate: "2026-12-01", deadline: "2026-10-04", budget: "₹4–6 lakh", owner: "Priya Nair", status: "Reviewing", requestedStyle: "Tamil · uplifting · family travel", songs: [
      { title: "Vaanam Thodum", film: "Neela Mazhai", fit: "Strong match", recording: "Recorded for India; term dates need confirmation", composition: "Publisher share not documented", note: "Hold requested while the publishing share is confirmed." },
      { title: "Maalai Neram", film: "Oru Veesum Kaatru", fit: "Good match", recording: "Recorded rights appear active for India", composition: "Recorded rights details available; composition record needs review", note: "A recent compilation use falls inside the reuse cooldown." },
      { title: "Pudhu Paadhai", film: "Veedu Vaanam", fit: "Possible match", recording: "Recorded rights expire soon", composition: "Composition ownership is unclear", note: "Escalate the expiry and ownership gaps before quoting." },
    ],
  },
  {
    id: "req-sunbird-travel", clientId: "sunbird-creative", client: "Sunbird Creative", title: "Instrumental for a travel film", brief: "A spacious instrumental with a gentle build for a 30-second digital film.", campaign: "Beyond the Coast", use: "Digital advertising", platform: "Web and social", territory: "India", startDate: "2026-11-01", endDate: "2027-01-31", deadline: "2026-10-09", budget: "₹2–3 lakh", owner: "Kavya Raman", status: "Received", requestedStyle: "Instrumental · cinematic · Hindi or Tamil", songs: [
      { title: "Quiet Shore (Instrumental)", film: "The Blue Shore", fit: "Strong match", recording: "Instrumental version is listed; verify master owner", composition: "Composition record on file", note: "Alternate version links to the original song record." },
      { title: "First Light", film: "Safar", fit: "Possible match", recording: "India rights recorded", composition: "Publisher confirmation pending", note: "Check whether the 30-second edit is permitted." },
    ],
  },
  {
    id: "req-bluepeacock-drama", clientId: "blue-peacock-broadcast", client: "Blue Peacock Broadcast", title: "Theme songs for a regional drama", brief: "Shortlist theme options for a new weekly drama and review broadcast plus promotional use.", campaign: "Kadal Veedu", use: "Television broadcast and promos", platform: "Linear TV, catch-up", territory: "India", startDate: "2026-11-15", endDate: "2027-11-14", deadline: "2026-10-12", budget: "₹8–12 lakh", owner: "Priya Nair", status: "Quoted", requestedStyle: "Emotional · melodic · Tamil", songs: [
      { title: "Nila Kaayum", film: "Nila Vaasal", fit: "Strong match", recording: "Recorded rights active for India", composition: "Composition record listed", note: "Quote excludes soundtrack album rights." },
      { title: "Oru Naal", film: "Aazhi", fit: "Review needed", recording: "India rights not found", composition: "Not documented", note: "Do not include in the offer until records are resolved." },
    ],
  },
  {
    id: "req-mango-launch", clientId: "mango-tree-media", client: "Mango Tree Media", title: "Regional music for a product launch", brief: "Find an energetic Tamil track for a short launch film, with online use across two territories.", campaign: "Everyday Better", use: "Online campaign", platform: "YouTube, Instagram", territory: "India, Singapore", startDate: "2026-11-10", endDate: "2027-02-10", deadline: "2026-10-16", budget: "₹5–8 lakh", owner: "Kavya Raman", status: "Approved", requestedStyle: "Energetic · Tamil · modern", songs: [
      { title: "Vaanam Thodum", film: "Neela Mazhai", fit: "Selected", recording: "India record reviewed; Singapore confirmation pending", composition: "Publisher share not documented", note: "Approval is for shortlist planning; final clearance is still required." },
    ],
  },
  {
    id: "req-lotus-series", clientId: "lotus-pictures", client: "Lotus Pictures", title: "Background score for a web series", brief: "Instrumental and low-key songs for a six-episode series.", campaign: "Small Town Stories", use: "Series soundtrack", platform: "OTT", territory: "India", startDate: "2027-01-01", endDate: "2027-12-31", deadline: "2026-10-20", budget: "₹6–9 lakh", owner: "Priya Nair", status: "Received", requestedStyle: "Instrumental · intimate · Tamil", songs: [
      { title: "Mounam Pesum", film: "Nila Vaasal", fit: "Possible match", recording: "Rights need a date check", composition: "Composition owner is listed", note: "Confirm media scope with the buyer before quoting." },
    ],
  },
];

export const demoNotifications: DemoNotification[] = [
  { id: "notice-match", kind: "Suggestion", title: "3 songs match the Lotus Pictures brief", detail: "Tamil, uplifting, and within the requested campaign dates.", age: "4 min ago", href: "/licensing/req-lotus-youtube", unread: true },
  { id: "notice-renewal", kind: "Update", title: "2 rights records need a renewal review", detail: "Veedu Vaanam has a recorded expiry coming up in 34 days.", age: "22 min ago", href: "/renewals", unread: true },
  { id: "notice-community", kind: "Community", title: "A new rights thread is getting replies", detail: "Members are discussing regional broadcast terms.", age: "1 hr ago", href: "/community/posts/post-regional-rights", unread: true },
  { id: "notice-metadata", kind: "Suggestion", title: "12 catalogue records may need metadata", detail: "Review missing language, performer, and version details.", age: "Yesterday", href: "/catalogue-setup", unread: false },
  { id: "notice-hold", kind: "Update", title: "A temporary hold ends this week", detail: "Check the hold on Vaanam Thodum before sending a quote.", age: "Yesterday", href: "/holds", unread: false },
  { id: "notice-event", kind: "Community", title: "Regional music rights roundtable", detail: "The community event starts Thursday at 3:00 PM IST.", age: "Sep 28", href: "/community", unread: false },
];

export const demoCommunityPosts: DemoCommunityPost[] = [
  { id: "post-regional-rights", author: "Ananya Rao", role: "Music supervisor · Blue Peacock Broadcast", initials: "AR", category: "Rights practice", time: "18 min ago", title: "How are teams documenting regional broadcast and promo scope?", body: "We are updating our internal request checklist. For a regional drama, do you record catch-up and social promos as separate media rows, or keep them together and note the carve-outs? Interested in how other teams make this clear for buyers.", tags: ["Broadcast", "Clearance"], likes: 18, replies: 7 },
  { id: "post-tamil-sync", author: "Kavya Raman", role: "Catalogue manager", initials: "KR", category: "Catalogue tips", time: "2 hr ago", title: "A quick checklist for linking alternate song versions", body: "We have started grouping originals, instrumentals, clean edits, and remixes under one song family. We still review rights at the individual version level. Sharing the fields our team found useful: version label, parent recording, ISRC, edit length, and a rights review note.", tags: ["Versions", "Metadata"], likes: 31, replies: 12 },
  { id: "post-first-quote", author: "Meena Sundaram", role: "Music supervisor · Lotus Pictures", initials: "MS", category: "Ask the community", time: "Yesterday", title: "What makes a shortlist easy for a production team to review?", body: "We are trying to keep the first pass compact without losing the information a producer needs. Do you put rights gaps beside each track, or keep the shortlist focused and add a separate clearance summary?", tags: ["Shortlists", "Workflow"], likes: 11, replies: 5 },
  { id: "post-roundtable", author: "Pyramid Community", role: "Community team", initials: "PC", category: "Announcement", time: "Sep 27", title: "Join the regional music rights roundtable", body: "A friendly peer session on territory notes, media scope, and how catalogue teams explain what their records do and do not confirm. Bring one workflow question for the group.", tags: ["Event", "Regional rights"], likes: 24, replies: 9 },
];

export const demoCommunityMembers = [
  { name: "Ananya Rao", role: "Music supervisor", organization: "Blue Peacock Broadcast", initials: "AR", location: "Bengaluru" },
  { name: "Meena Sundaram", role: "Music supervisor", organization: "Lotus Pictures", initials: "MS", location: "Chennai" },
  { name: "Kavya Raman", role: "Catalogue manager", organization: "Pyramid member", initials: "KR", location: "Chennai" },
  { name: "Arjun Mehta", role: "Executive producer", organization: "Sunbird Creative", initials: "AM", location: "Mumbai" },
];

export const demoEvents = [
  { id: "regional-roundtable", title: "Regional music rights roundtable", date: "Thu, Oct 8 · 3:00 PM IST", format: "Online · 45 minutes", attendees: 18 },
  { id: "catalogue-clinic", title: "Catalogue metadata clinic", date: "Tue, Oct 13 · 11:30 AM IST", format: "Online · bring a sample sheet", attendees: 11 },
];

export const demoHolds = [
  { id: "hold-01", song: "Vaanam Thodum", film: "Neela Mazhai", client: "Lotus Pictures", territory: "India", media: "YouTube, Instagram", expires: "2026-10-05", requestId: "req-lotus-youtube", status: "Active", owner: "Priya Nair" },
  { id: "hold-02", song: "Quiet Shore (Instrumental)", film: "The Blue Shore", client: "Sunbird Creative", territory: "India", media: "Web and social", expires: "2026-10-09", requestId: "req-sunbird-travel", status: "Active", owner: "Kavya Raman" },
  { id: "hold-03", song: "Nila Kaayum", film: "Nila Vaasal", client: "Blue Peacock Broadcast", territory: "India", media: "TV and catch-up", expires: "2026-10-11", requestId: "req-bluepeacock-drama", status: "Conflict check", owner: "Priya Nair" },
];

export const demoDeals = [
  { id: "deal-01", requestId: "req-bluepeacock-drama", client: "Blue Peacock Broadcast", title: "Kadal Veedu theme shortlist", type: "Quote", amount: "₹9.2 lakh", updated: "Sep 29, 2026", stage: "Quote sent" },
  { id: "deal-02", requestId: "req-mango-launch", client: "Mango Tree Media", title: "Everyday Better launch", type: "License in review", amount: "₹6.4 lakh", updated: "Sep 28, 2026", stage: "Approved shortlist" },
  { id: "deal-03", requestId: "req-lotus-youtube", client: "Lotus Pictures", title: "Monsoon Routes campaign", type: "Quote draft", amount: "₹4.8 lakh", updated: "Today", stage: "Rights review" },
];

export const demoRenewals = [
  { id: "renew-01", client: "Blue Peacock Broadcast", song: "Pudhu Paadhai", film: "Veedu Vaanam", type: "Catalogue rights expiry", due: "2026-11-04", owner: "Rights team", note: "Confirm extension terms with the recorded rights owner." },
  { id: "renew-02", client: "Mango Tree Media", song: "Vaanam Thodum", film: "Neela Mazhai", type: "Customer license option", due: "2026-10-20", owner: "Kavya Raman", note: "Buyer has an optional three-month extension; exercise window closes soon." },
  { id: "renew-03", client: "Lotus Pictures", song: "Maalai Neram", film: "Oru Veesum Kaatru", type: "Customer license end date", due: "2026-12-01", owner: "Priya Nair", note: "Check whether the campaign needs a term extension." },
];

export const demoChart = [
  { label: "May", requests: 9, quoted: 4 },
  { label: "Jun", requests: 13, quoted: 7 },
  { label: "Jul", requests: 11, quoted: 6 },
  { label: "Aug", requests: 18, quoted: 10 },
  { label: "Sep", requests: 22, quoted: 14 },
  { label: "Oct", requests: 16, quoted: 9 },
];

const daysFromToday = (offset: number) => {
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() + offset);
  return date.toISOString().slice(0, 10);
};

function addMonthsClamped(dateText: string, months: number) {
  const date = new Date(`${dateText}T00:00:00.000Z`);
  const day = date.getUTCDate();
  date.setUTCDate(1);
  date.setUTCMonth(date.getUTCMonth() + months);
  const lastDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate();
  date.setUTCDate(Math.min(day, lastDay));
  return date;
}

function getRightsStatus(startDate: string, periodMonths: number, perpetual: boolean, expiringSoonDays: number) {
  if (perpetual) return { expiry_date: null, status: "perpetual" };
  const expiry = addMonthsClamped(startDate, periodMonths);
  expiry.setUTCDate(expiry.getUTCDate() - 1);
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const daysRemaining = Math.floor((expiry.getTime() - today.getTime()) / 86400000);
  return {
    expiry_date: expiry.toISOString().slice(0, 10),
    status: daysRemaining < 0 ? "expired" : daysRemaining <= expiringSoonDays ? "expiring_soon" : "active",
  };
}

export function makeDemoWorkspace() {
  const songs: ShowcaseRow[] = [
    { id: "song-vaanam", film_id: "film-neela", title: "Vaanam Thodum", singer: "Nila Prakash", language: "Tamil", genre: "Melodic", year: 2022, version_count: 3 },
    { id: "song-maalai", film_id: "film-neela", title: "Maalai Neram", singer: "Arun Dev", language: "Tamil", genre: "Romantic", year: 2022, version_count: 2 },
    { id: "song-pudhu", film_id: "film-veedu", title: "Pudhu Paadhai", singer: "Mira Kannan", language: "Tamil", genre: "Indie pop", year: 2021, version_count: 1 },
    { id: "song-oru-naal", film_id: "film-aazhi", title: "Oru Naal", singer: "Sanjay Ravi", language: "Tamil", genre: "Drama", year: 2019, version_count: 2 },
    { id: "song-nila", film_id: "film-nila", title: "Nila Kaayum", singer: "Karthik Suresh", language: "Tamil", genre: "Classical fusion", year: 2020, version_count: 2 },
    { id: "song-first-light", film_id: "film-nila", title: "First Light", singer: "The Coastline Project", language: "Instrumental", genre: "Ambient", year: 2020, version_count: 1 },
  ];
  const films: ShowcaseRow[] = [
    { id: "film-neela", title: "Neela Mazhai", release_year: 2022, language: "Tamil", genre: "Romance", synopsis: "A young photographer returns home during the monsoon and reconnects with her community.", songs: songs.filter((song) => song.film_id === "film-neela") },
    { id: "film-veedu", title: "Veedu Vaanam", release_year: 2021, language: "Tamil", genre: "Drama", synopsis: "A family rebuilds its old theatre and finds a new place in the changing city.", songs: songs.filter((song) => song.film_id === "film-veedu") },
    { id: "film-aazhi", title: "Aazhi", release_year: 2019, language: "Tamil", genre: "Drama", synopsis: "Two siblings set out along the coast to uncover a story their village has carried for generations.", songs: songs.filter((song) => song.film_id === "film-aazhi") },
    { id: "film-nila", title: "Nila Vaasal", release_year: 2020, language: "Tamil", genre: "Family", synopsis: "An old family house becomes a meeting place for musicians, neighbors, and a new generation.", songs: songs.filter((song) => song.film_id === "film-nila") },
  ];
  const rightsSource = [
    { id: "right-neela-india", film_id: "film-neela", owner: "Aalayam Music House", territory: "India", start_date: daysFromToday(-60), license_period_months: 12, is_perpetual: false },
    { id: "right-veedu-india", film_id: "film-veedu", owner: "Veedu Audio Works", territory: "India", start_date: daysFromToday(-330), license_period_months: 12, is_perpetual: false },
    { id: "right-aazhi-uk", film_id: "film-aazhi", owner: "Blue Coast Records", territory: "United Kingdom", start_date: daysFromToday(-500), license_period_months: 12, is_perpetual: false },
    { id: "right-nila-india", film_id: "film-nila", owner: "Nila Vaasal Trust", territory: "India", start_date: daysFromToday(-800), license_period_months: null, is_perpetual: true },
  ];
  const settings = [{ id: true, expiring_soon_days: 90, song_reuse_cooldown_days: 180 }];
  const rights = rightsSource.map((right) => {
    const film = films.find((row) => row.id === right.film_id);
    return { ...right, film_title: film?.title ?? "Unknown film", ...getRightsStatus(right.start_date as string, Number(right.license_period_months ?? 0), Boolean(right.is_perpetual), settings[0].expiring_soon_days) };
  });
  const compilations: ShowcaseRow[] = [
    { id: "comp-001", name: "Coastal Stories Vol. 1", territory: "India", created_at: daysFromToday(-14), compilation_items: [{ id: "item-001", song_id: "song-maalai", songs: { title: "Maalai Neram", singer: "Arun Dev" } }, { id: "item-002", song_id: "song-nila", songs: { title: "Nila Kaayum", singer: "Karthik Suresh" } }] },
    { id: "comp-002", name: "Morning Light Picks", territory: "India", created_at: daysFromToday(-5), compilation_items: [{ id: "item-003", song_id: "song-first-light", songs: { title: "First Light", singer: "The Coastline Project" } }, { id: "item-004", song_id: "song-vaanam", songs: { title: "Vaanam Thodum", singer: "Nila Prakash" } }] },
    { id: "comp-003", name: "South Screen Themes", territory: "India", created_at: daysFromToday(-1), compilation_items: [{ id: "item-005", song_id: "song-pudhu", songs: { title: "Pudhu Paadhai", singer: "Mira Kannan" } }] },
  ];
  const usage = compilations.flatMap((compilation) => (compilation.compilation_items as ShowcaseRow[]).map((item) => ({ id: item.id, added_at: compilation.created_at, songs: item.songs, compilations: { name: compilation.name, territory: compilation.territory, created_at: compilation.created_at } })));
  const team: ShowcaseRow[] = [
    { id: "profile-admin", email: "priya@pyramid.demo", role: "admin", created_at: daysFromToday(-420) },
    { id: "profile-editor", email: "kavya@pyramid.demo", role: "editor", created_at: daysFromToday(-210) },
    { id: "profile-viewer", email: "meena@pyramid.demo", role: "viewer", created_at: daysFromToday(-62) },
  ];
  const today = new Date();
  const cooldownDays = settings[0].song_reuse_cooldown_days;
  const territories = ["India", "United Kingdom"];
  const eligibility = territories.flatMap((territory) => songs.map((song) => {
    const film = films.find((row) => row.id === song.film_id);
    const lastUse = usage.filter((row) => (row.songs as ShowcaseRow).id === song.id || (row.songs as ShowcaseRow).title === song.title).sort((a, b) => String(b.added_at).localeCompare(String(a.added_at)))[0];
    const rightsRow = rights.find((right) => right.film_id === song.film_id && right.territory === territory);
    const lastUsedDate = lastUse ? new Date(`${String(lastUse.added_at).slice(0, 10)}T00:00:00Z`) : null;
    const daysSinceUse = lastUsedDate ? Math.floor((today.getTime() - lastUsedDate.getTime()) / 86400000) : null;
    const recentlyUsed = daysSinceUse !== null && daysSinceUse < cooldownDays;
    const rightsStatus = rightsRow?.status as string | undefined;
    const hasCurrentRights = rightsStatus === "active" || rightsStatus === "expiring_soon" || rightsStatus === "perpetual";
    const eligible = hasCurrentRights && !recentlyUsed;
    const reason = !rightsRow ? "No rights for this territory" : rightsStatus === "expired" ? `Rights expired on ${rightsRow.expiry_date}` : recentlyUsed ? `Used in ${(lastUse?.compilations as ShowcaseRow)?.name ?? "a compilation"} ${daysSinceUse} days ago` : "Eligible";
    return { song_id: song.id, song_title: song.title, film_id: song.film_id, film_title: film?.title ?? "Unknown film", singer: song.singer, language: song.language, genre: song.genre, year: song.year, territory, eligible, reason, last_used_at: lastUse?.added_at ?? null, rights_expiry_date: rightsRow?.expiry_date ?? null, rights_status: rightsStatus ?? null };
  }));
  return { films, songs, rights, compilations, usage, team, settings, eligibility, territories };
}

export function getDemoRows(section: string, workspace = makeDemoWorkspace()): ShowcaseRow[] {
  switch (section) {
    case "dashboard": return workspace.rights;
    case "catalogue": return workspace.films;
    case "rights": return workspace.rights;
    case "usage": return workspace.usage;
    case "compilations": return workspace.compilations;
    case "team": return workspace.team;
    case "settings": return workspace.settings;
    default: return [];
  }
}

export function getDemoEligibility(territory: string, filters: { genre: string; singer: string; language: string; year: string }, workspace = makeDemoWorkspace()) {
  return workspace.eligibility.filter((row) => {
    const matchesTerritory = row.territory === territory;
    const matchesGenre = !filters.genre || String(row.genre).toLowerCase().includes(filters.genre.toLowerCase());
    const matchesSinger = !filters.singer || String(row.singer).toLowerCase().includes(filters.singer.toLowerCase());
    const matchesLanguage = !filters.language || String(row.language).toLowerCase().includes(filters.language.toLowerCase());
    const matchesYear = !filters.year || String(row.year) === filters.year;
    return matchesTerritory && matchesGenre && matchesSinger && matchesLanguage && matchesYear;
  });
}
