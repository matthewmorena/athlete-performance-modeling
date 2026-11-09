"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { FeaturedAthlete, FeaturedEventGroup } from "@/lib/types";

type Group = "All" | FeaturedEventGroup;
const GROUPS: Group[] = ["All", "Sprints", "Distance", "Jumps", "Throws", "Other"];
const fmt = (n: number | null) => n === null ? "—" : n.toLocaleString();
const change = (n: number | null) => n === null ? "New" : `${n >= 0 ? "+" : ""}${n.toLocaleString()}`;
const direction = (n: number | null) => n === null ? "" : n >= 0 ? "board-up" : "board-down";

export default function MarketDashboard({ athletes, failedCount }: { athletes: FeaturedAthlete[]; failedCount: number }) {
  const [group, setGroup] = useState<Group>("All");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(athletes[0]?.id ?? "");
  const ranked = useMemo(() => [...athletes].sort((a, b) => (b.rating ?? -Infinity) - (a.rating ?? -Infinity) || a.name.localeCompare(b.name)), [athletes]);
  const filtered = ranked.filter(a => (group === "All" || a.group === group) && `${a.name} ${a.school} ${a.event}`.toLowerCase().includes(query.trim().toLowerCase()));
  const selected = athletes.find(a => a.id === selectedId) ?? ranked[0];
  const leader = ranked.find(a => a.rating !== null);
  const mover = [...athletes].filter(a => a.delta !== null).sort((a, b) => Math.abs(b.delta ?? 0) - Math.abs(a.delta ?? 0))[0];
  const history = selected?.history.slice(-6) ?? [];
  const values = history.map(p => p.rating);
  const min = Math.min(...values) - 25;
  const range = Math.max(Math.max(...values) + 25 - min, 1);
  const points = values.map((v, i) => ({ x: values.length === 1 ? 250 : 18 + i * 464 / (values.length - 1), y: 240 - (v - min) / range * 220 }));
  const area = points.length ? `M ${points[0].x} 260 L ${points.map(p => `${p.x} ${p.y}`).join(" L ")} L ${points.at(-1)!.x} 260 Z` : "";

  return <div className="exchange-board">
    {athletes.length > 0 && <div className="board-tape" aria-label="Featured performance ratings"><div className="board-tape-track">{[0, 1].map(copy => <div className="board-tape-set" key={copy} aria-hidden={copy === 1 ? true : undefined}>{ranked.map(a => <span className="board-tape-item" key={a.id}><b>{a.initials}</b><span>{a.name}</span><span>{fmt(a.rating)}</span><span className={direction(a.delta)}>{change(a.delta)}</span></span>)}</div>)}</div></div>}
    <header className="board-mast"><h1>Athlete ratings</h1></header>
    {failedCount > 0 && <p className="board-notice" role="status">{athletes.length ? `${failedCount} of ${athletes.length + failedCount} featured profiles are currently unavailable.` : "The athlete feed is currently unavailable. Please try again shortly."}</p>}
    <div className="board-workspace">
      <section className="board-list" aria-label="Athlete performance board">
        <div className="board-tools"><label className="board-search"><span className="board-label">Filter board</span><input type="search" placeholder="Filter by name, school, or event" value={query} onChange={e => setQuery(e.target.value)} /></label><div className="board-filters" aria-label="Event group filters">{GROUPS.filter(g => g !== "Other" || athletes.some(a => a.group === "Other")).map(g => <button key={g} type="button" aria-pressed={group === g} onClick={() => setGroup(g)}>{g}</button>)}</div></div>
        <div className="board-stats">
          <div><span className="board-label">Rating leader</span><b>{fmt(leader?.rating ?? null)}</b><span className="board-micro">{leader?.name ?? "No rated performances"}</span></div>
          <div><span className="board-label">Biggest move</span><b className={direction(mover?.delta ?? null)}>{mover ? change(mover.delta) : "—"}</b><span className="board-micro">{mover?.name ?? "Awaiting results"}</span></div>
          <div><span className="board-label">Scored results</span><b>{athletes.reduce((sum, a) => sum + a.scoredResults, 0).toLocaleString()}</b><span className="board-micro">Recent performances</span></div>
          <div><span className="board-label">Profiles loaded</span><b>{athletes.length} / {athletes.length + failedCount}</b><span className="board-micro">Featured athletes</span></div>
        </div>
        <div className="board-table-wrap"><table className="board-table"><thead><tr><th className="board-rank">RK</th><th>Athlete</th><th className="board-event-column">Event</th><th className="board-result-column">Last result</th><th className="board-number">Rating</th><th className="board-number">Δ</th></tr></thead><tbody>{filtered.map(a => <tr key={a.id} className={selected?.id === a.id ? "is-selected" : ""} onClick={() => setSelectedId(a.id)}>
          <td className="board-rank">{String(ranked.indexOf(a) + 1).padStart(2, "0")}</td><td><button type="button" className="board-athlete" aria-pressed={selected?.id === a.id} onClick={() => setSelectedId(a.id)}><span className="board-bib">{a.initials}</span><span><strong>{a.name}</strong><small>{a.school}</small></span></button></td><td className="board-event-column board-event">{a.event}</td><td className="board-result-column"><strong className="board-mark">{a.mark}</strong><span className="board-micro">Place {a.place}</span></td><td className="board-number board-rating">{fmt(a.rating)}</td><td className={`board-number ${direction(a.delta)}`}><strong>{change(a.delta)}</strong><span className="board-micro">points</span></td>
        </tr>)}</tbody></table>{!filtered.length && <p className="board-empty">{athletes.length ? "No athletes match. Try another search or event group." : "Featured athletes will appear when the feed is available."}</p>}</div>
        <p className="board-coverage">Showing {filtered.length} of {athletes.length} featured profiles. Changes compare the two latest scored performances.</p>
      </section>
      {selected ? <aside className="board-quote" aria-label="Selected athlete performance sheet">
        <header className="board-quote-head"><h2>{selected.name}</h2><p>{selected.school} · {selected.year} · {selected.event}</p></header>
        <div className="board-quote-price"><div><span className="board-label">Performance rating</span><b>{fmt(selected.rating)}</b></div><div><span className="board-label">Latest change</span><b className={direction(selected.delta)}>{change(selected.delta)}</b><span className="board-micro">{selected.delta === null ? "Needs two scored results" : "Rating points"}</span></div></div>
        <div className="board-latest"><div><span className="board-label">Latest result / {selected.resultDate}</span><h3>{selected.meet}</h3><p>Place {selected.place} · {selected.event}</p></div><strong>{selected.mark}</strong></div>
        <div className="board-chart">{points.length ? <><svg viewBox="0 0 500 260" role="img" aria-label={`${selected.name}: ${history.map(p => `${p.dateLabel}, ${p.rating} points`).join("; ")}`}><path d={area} fill="var(--chart-fill)" /><polyline points={points.map(p => `${p.x},${p.y}`).join(" ")} fill="none" stroke="var(--chart)" strokeWidth="3" />{points.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={i === points.length - 1 ? 5 : 3} fill="var(--background)" stroke="var(--accent)" strokeWidth="2"><title>{`${history[i].dateLabel}: ${history[i].rating}`}</title></circle>)}</svg><span className="board-chart-note">{history[0].dateLabel} → {history.at(-1)!.dateLabel} / recent ratings</span></> : <p className="board-empty">No supported performance rating history yet.</p>}</div>
        <div className="board-quote-grid">{[["Event group", selected.group], ["Class", selected.year], ["Scored results", selected.scoredResults], ["Total results", selected.totalResults]].map(([label, value]) => <div key={label}><span className="board-label">{label}</span><b>{value}</b></div>)}</div>
        <div className="board-actions"><Link href={`/athletes/${selected.id}`}>View full profile ↗</Link><a href={selected.sourceUrl} target="_blank" rel="noreferrer">TFRRS source ↗</a></div>
      </aside> : <aside className="board-empty">Select an athlete to explore their performance.</aside>}
    </div>
    <footer className="board-footer"><span>Track Exchange</span><span>Collegiate track &amp; field / cross country</span></footer>
  </div>;
}
