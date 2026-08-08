"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type {
  FeaturedAthlete,
  FeaturedEventGroup,
  FeaturedRatingPoint,
} from "@/lib/types";

type EventGroup = "All" | FeaturedEventGroup;

interface MarketDashboardProps {
  athletes: FeaturedAthlete[];
  failedCount: number;
}

const GROUP_ORDER: FeaturedEventGroup[] = [
  "Sprints",
  "Distance",
  "Jumps",
  "Throws",
  "Other",
];

function formatRating(value: number | null): string {
  return value === null ? "—" : value.toLocaleString();
}

function formatDelta(value: number | null): string {
  if (value === null) return "New";
  return `${value >= 0 ? "+" : ""}${value.toLocaleString()}`;
}

function trendPoints(history: FeaturedRatingPoint[]) {
  const width = 320;
  const height = 104;
  const padding = 10;
  const values = history.map((point) => point.rating);
  const minimum = Math.min(...values) - 20;
  const maximum = Math.max(...values) + 20;
  const range = Math.max(maximum - minimum, 1);
  const step = (width - padding * 2) / Math.max(values.length - 1, 1);

  return values.map((value, index) => ({
    x: padding + index * step,
    y: height - padding - ((value - minimum) / range) * (height - padding * 2),
  }));
}

function AthleteIdentity({ athlete }: { athlete: FeaturedAthlete }) {
  return (
    <span className="flex min-w-0 items-center gap-3 text-left">
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-surface text-[11px] font-extrabold text-foreground">
        {athlete.initials}
      </span>
      <span className="min-w-0">
        <span className="block truncate font-semibold text-foreground">{athlete.name}</span>
        <span className="block truncate text-xs text-muted">
          {athlete.school} · {athlete.event}
        </span>
      </span>
    </span>
  );
}

function EmptyDashboard({ failedCount }: { failedCount: number }) {
  return (
    <div className="px-0 py-0 sm:px-3 sm:py-4 lg:px-6">
      <div className="market-shell mx-auto grid min-h-[calc(100vh-69px)] max-w-[1440px] place-items-center border-x border-border bg-background px-5 sm:min-h-[560px] sm:rounded-3xl sm:border">
        <section className="max-w-xl rounded-2xl border border-border bg-panel p-6 text-center shadow-[0_18px_50px_rgb(0_0_0/0.22)]">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
            Featured athlete feed
          </p>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-foreground">
            The athlete API is not available.
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted">
            None of the {failedCount} configured profiles could be loaded. Confirm that the Express
            backend is running and that <code className="text-foreground">NEXT_PUBLIC_API_URL</code>
            points to it.
          </p>
        </section>
      </div>
    </div>
  );
}

export default function MarketDashboard({
  athletes,
  failedCount,
}: MarketDashboardProps) {
  const [activeGroup, setActiveGroup] = useState<EventGroup>("All");
  const [selectedId, setSelectedId] = useState(athletes[0]?.id ?? "");

  const availableGroups = useMemo<EventGroup[]>(() => {
    const presentGroups = new Set(athletes.map((athlete) => athlete.group));
    return ["All", ...GROUP_ORDER.filter((group) => presentGroups.has(group))];
  }, [athletes]);

  const filteredAthletes = useMemo(
    () => athletes.filter((athlete) => activeGroup === "All" || athlete.group === activeGroup),
    [activeGroup, athletes],
  );

  const rankedAthletes = useMemo(
    () =>
      [...athletes].sort((a, b) => {
        if (a.rating === null && b.rating === null) return a.name.localeCompare(b.name);
        if (a.rating === null) return 1;
        if (b.rating === null) return -1;
        return b.rating - a.rating;
      }),
    [athletes],
  );

  if (!athletes.length) return <EmptyDashboard failedCount={failedCount} />;

  const selectedAthlete =
    athletes.find((athlete) => athlete.id === selectedId) ?? athletes[0];
  const recentHistory = selectedAthlete.history.slice(-6);
  const points = recentHistory.length > 0 ? trendPoints(recentHistory) : [];
  const polyline = points.map(({ x, y }) => `${x},${y}`).join(" ");
  const firstPoint = points[0];
  const lastPoint = points.at(-1);
  const areaPath =
    firstPoint && lastPoint
      ? `M ${firstPoint.x} 104 L ${points
          .map(({ x, y }) => `${x} ${y}`)
          .join(" L ")} L ${lastPoint.x} 104 Z`
      : "";

  const ratedAthletes = rankedAthletes.filter((athlete) => athlete.rating !== null);
  const leader = ratedAthletes[0];
  const biggestMove = athletes
    .filter((athlete) => athlete.delta !== null)
    .sort((a, b) => Math.abs(b.delta ?? 0) - Math.abs(a.delta ?? 0))[0];
  const scoredPerformanceCount = athletes.reduce(
    (total, athlete) => total + athlete.scoredResults,
    0,
  );
  const configuredCount = athletes.length + failedCount;

  function selectGroup(group: EventGroup) {
    setActiveGroup(group);
    const firstMatch = athletes.find(
      (athlete) => group === "All" || athlete.group === group,
    );
    if (firstMatch) setSelectedId(firstMatch.id);
  }

  return (
    <div className="px-0 py-0 sm:px-3 sm:py-4 lg:px-6">
      <div className="market-shell mx-auto min-h-[calc(100vh-69px)] max-w-[1440px] overflow-hidden border-x border-border bg-background sm:min-h-0 sm:rounded-3xl sm:border">
        <div className="flex gap-6 overflow-hidden border-b border-border px-4 py-2 text-xs text-muted sm:px-6">
          {rankedAthletes.slice(0, 4).map((athlete) => (
            <span key={athlete.id} className="shrink-0 whitespace-nowrap">
              <strong className="text-foreground">{athlete.name}</strong>{" "}
              {formatRating(athlete.rating)}{" "}
              <span
                className={
                  athlete.delta === null
                    ? "text-muted"
                    : athlete.delta >= 0
                      ? "text-positive"
                      : "text-negative"
                }
              >
                {athlete.delta === null ? "NEW" : athlete.delta >= 0 ? "▲" : "▼"}
                {athlete.delta === null ? "" : Math.abs(athlete.delta)}
              </span>
            </span>
          ))}
        </div>

        <div className="p-4 sm:p-6">
          <section className="flex items-end justify-between gap-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                Featured athlete overview
              </p>
              <h1 className="mt-1 max-w-3xl text-3xl font-extrabold leading-none tracking-[-0.045em] text-foreground sm:text-5xl">
                Performance, priced by momentum.
              </h1>
            </div>
            <span className="hidden rounded-full border border-border px-3 py-2 text-xs text-muted md:inline-flex">
              <span className="mr-2 text-accent">●</span> Live profiles from the athlete API
            </span>
          </section>

          {failedCount > 0 && (
            <p className="mt-4 rounded-xl border border-accent/30 bg-accent/10 px-3 py-2 text-xs text-foreground">
              {failedCount} of {configuredCount} featured profile{configuredCount === 1 ? "" : "s"}
              {failedCount === 1 ? " was" : " were"} unavailable for this request.
            </p>
          )}

          <section className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Featured summary">
            {[
              [
                "Rating leader",
                formatRating(leader?.rating ?? null),
                leader ? `${leader.name} · ${leader.event}` : "No rated performances",
                false,
              ],
              [
                "Biggest move",
                formatDelta(biggestMove?.delta ?? null),
                biggestMove
                  ? `${biggestMove.name} · ${biggestMove.mark}`
                  : "Needs two scored results",
                (biggestMove?.delta ?? 0) >= 0 && biggestMove?.delta !== null,
              ],
              [
                "Scored results",
                scoredPerformanceCount.toLocaleString(),
                "Recent supported running events",
                false,
              ],
              [
                "Profiles loaded",
                `${athletes.length}/${configuredCount}`,
                "Configured TFRRS athlete IDs",
                false,
              ],
            ].map(([label, value, detail, positive]) => (
              <article key={String(label)} className="rounded-2xl border border-border bg-panel p-4">
                <small className="text-xs text-muted">{String(label)}</small>
                <strong
                  className={`mt-2 block text-2xl ${positive ? "text-positive" : "text-foreground"}`}
                >
                  {String(value)}
                </strong>
                <span className="mt-1 block text-xs text-muted">{String(detail)}</span>
              </article>
            ))}
          </section>

          <section className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.65fr)]">
            <article className="rounded-2xl border border-border bg-panel">
              <header className="flex items-start justify-between gap-4 p-4 sm:p-5">
                <div>
                  <h2 className="font-bold text-foreground">Performance movers</h2>
                  <p className="mt-1 text-xs text-muted">
                    Change between each athlete&apos;s two latest scorable results
                  </p>
                </div>
                <span className="rounded-full border border-border px-3 py-1.5 text-xs text-muted">
                  {filteredAthletes.length} athlete{filteredAthletes.length === 1 ? "" : "s"}
                </span>
              </header>

              <div className="flex flex-wrap gap-2 px-4 pb-2 sm:px-5" aria-label="Event group filters">
                {availableGroups.map((group) => {
                  const isActive = activeGroup === group;
                  return (
                    <button
                      key={group}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => selectGroup(group)}
                      className={
                        isActive
                          ? "rounded-full border border-accent bg-accent px-3 py-1.5 text-xs font-bold text-accent-ink"
                          : "rounded-full border border-border px-3 py-1.5 text-xs text-muted transition-colors hover:border-accent/50 hover:text-foreground"
                      }
                    >
                      {group}
                    </button>
                  );
                })}
              </div>

              <div className="px-4 pb-3 sm:px-5">
                {filteredAthletes.map((athlete) => (
                  <div
                    key={athlete.id}
                    className="flex items-center justify-between gap-4 border-b border-border py-3 last:border-b-0"
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedId(athlete.id)}
                      className="group min-w-0 flex-1 rounded-lg text-left"
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-surface text-[11px] font-extrabold">
                          {athlete.initials}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate font-semibold transition-colors group-hover:text-accent">
                            {athlete.name}
                          </span>
                          <span className="block truncate text-xs text-muted">
                            {athlete.school} · {athlete.event}
                          </span>
                        </span>
                      </span>
                    </button>
                    <div className="shrink-0 text-right font-bold">
                      {formatRating(athlete.rating)}
                      <div
                        className={`mt-0.5 text-xs ${
                          athlete.delta === null
                            ? "text-muted"
                            : athlete.delta >= 0
                              ? "text-positive"
                              : "text-negative"
                        }`}
                      >
                        {formatDelta(athlete.delta)} rating
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <aside className="rounded-2xl border border-border bg-panel p-4 sm:p-5" aria-label="Selected athlete">
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full border border-border px-3 py-1.5 text-xs text-muted">
                  {selectedAthlete.event}
                </span>
                <span className="text-xs text-muted">
                  {selectedAthlete.scoredResults} scored
                </span>
              </div>

              <h2 className="mt-5 text-2xl font-bold tracking-tight">{selectedAthlete.name}</h2>
              <p className="mt-1 text-xs text-muted">
                {selectedAthlete.school} · {selectedAthlete.year}
              </p>
              <div className="mt-5 text-5xl font-extrabold tracking-[-0.06em]">
                {formatRating(selectedAthlete.rating)}
              </div>
              <p
                className={`mt-1 text-xs ${
                  selectedAthlete.delta === null
                    ? "text-muted"
                    : selectedAthlete.delta >= 0
                      ? "text-positive"
                      : "text-negative"
                }`}
              >
                {formatDelta(selectedAthlete.delta)} from the prior scored result
              </p>

              <div className="mt-5 border-y border-border py-3">
                {points.length > 0 ? (
                  <>
                    <svg
                      viewBox="0 0 320 110"
                      className="block w-full overflow-visible"
                      role="img"
                      aria-label={`${selectedAthlete.name} recent rating trend`}
                    >
                      <path d={areaPath} className="trend-area" />
                      <polyline points={polyline} className="trend-line" />
                      {points.map(({ x, y }, index) => (
                        <circle
                          key={`${recentHistory[index]?.date}-${recentHistory[index]?.rating}`}
                          cx={x}
                          cy={y}
                          r={index === points.length - 1 ? 5 : 3}
                          fill="var(--background)"
                          stroke="var(--accent)"
                          strokeWidth="2"
                        />
                      ))}
                    </svg>
                    <div className="flex justify-between gap-2 text-[10px] text-muted">
                      {recentHistory.map((point) => (
                        <span key={`${point.date}-${point.rating}`} className="truncate">
                          {point.dateLabel}
                        </span>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="grid min-h-28 place-items-center text-center text-xs text-muted">
                    No supported rating history for this athlete&apos;s current events.
                  </div>
                )}
              </div>

              <div className="mt-4">
                <small className="text-xs text-muted">Latest result · {selectedAthlete.resultDate}</small>
                <div className="mt-1 flex items-end justify-between gap-4">
                  <div>
                    <h3 className="font-bold">{selectedAthlete.meet}</h3>
                    <p className="mt-1 text-xs text-muted">{selectedAthlete.place}</p>
                  </div>
                  <strong className="text-2xl">{selectedAthlete.mark}</strong>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <Link
                  href={`/athletes/${selectedAthlete.id}`}
                  className="rounded-xl bg-accent px-3 py-2 text-xs font-bold text-accent-ink transition-opacity hover:opacity-90"
                >
                  View profile
                </Link>
                <a
                  href={selectedAthlete.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-border px-3 py-2 text-xs font-semibold text-muted transition-colors hover:border-accent/50 hover:text-foreground"
                >
                  TFRRS source ↗
                </a>
              </div>
            </aside>
          </section>

          <section id="rankings" className="mt-4 overflow-hidden rounded-2xl border border-border bg-panel">
            <header className="flex items-start justify-between gap-4 p-4 sm:p-5">
              <div>
                <h2 className="font-bold">Featured rating leaderboard</h2>
                <p className="mt-1 text-xs text-muted">
                  Latest supported performance score for each configured athlete
                </p>
              </div>
              <span className="rounded-full border border-border px-3 py-1.5 text-xs text-muted">
                API-backed
              </span>
            </header>

            <div className="trackside-scrollbar overflow-x-auto">
              <table className="w-full min-w-[820px] border-collapse text-left text-sm">
                <thead className="bg-surface text-xs text-muted">
                  <tr>
                    {["#", "Athlete", "Latest event", "Latest result", "Rating", "Results"].map(
                      (heading) => (
                        <th key={heading} className="border-t border-border px-4 py-3 font-semibold">
                          {heading}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {rankedAthletes.map((athlete, index) => (
                    <tr key={athlete.id} className="table-row transition-colors">
                      <td className="border-t border-border px-4 py-3 text-muted">{index + 1}</td>
                      <td className="border-t border-border px-4 py-3">
                        <button
                          type="button"
                          onClick={() => setSelectedId(athlete.id)}
                          className="max-w-[280px] rounded-lg"
                        >
                          <AthleteIdentity athlete={athlete} />
                        </button>
                      </td>
                      <td className="border-t border-border px-4 py-3">{athlete.event}</td>
                      <td className="border-t border-border px-4 py-3">
                        {athlete.place} · {athlete.mark}
                      </td>
                      <td className="border-t border-border px-4 py-3 font-bold">
                        {formatRating(athlete.rating)}{" "}
                        <span
                          className={
                            athlete.delta === null
                              ? "text-muted"
                              : athlete.delta >= 0
                                ? "text-positive"
                                : "text-negative"
                          }
                        >
                          {formatDelta(athlete.delta)}
                        </span>
                      </td>
                      <td className="border-t border-border px-4 py-3 text-muted">
                        {athlete.totalResults} total
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <p className="mt-3 text-xs text-muted">
            Athlete names, teams, events, marks, meets, and dates are loaded through the local API.
            Ratings are calculated only for supported individual running events.
          </p>
        </div>
      </div>
    </div>
  );
}
