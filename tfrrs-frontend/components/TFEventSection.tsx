"use client";

import { useId, useState } from "react";
import type { TrackEventGroup, TrackRound } from "@/lib/types";

interface TFEventSectionProps {
  eventGroup: TrackEventGroup;
  forceOpen?: boolean;
}

export default function TFEventSection({
  eventGroup,
  forceOpen = false,
}: TFEventSectionProps) {
  const [open, setOpen] = useState(forceOpen);
  const contentId = useId();

  const finals = eventGroup.rounds.filter((round) =>
    round.round?.toLowerCase().includes("final"),
  );
  const prelims = eventGroup.rounds.filter(
    (round) => !round.round?.toLowerCase().includes("final"),
  );
  const resultCount = eventGroup.rounds.reduce(
    (total, round) => total + round.results.length,
    0,
  );

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-panel shadow-[0_14px_36px_rgb(0_0_0/0.16)]">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-controls={contentId}
        className="group flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition-colors hover:bg-surface/70 sm:px-5"
      >
        <span className="min-w-0">
          <span className="block truncate font-bold text-foreground transition-colors group-hover:text-accent">
            {eventGroup.event_name}
          </span>
          <span className="mt-1 block text-xs text-muted">
            {eventGroup.rounds.length} round{eventGroup.rounds.length === 1 ? "" : "s"} · {resultCount}{" "}
            result{resultCount === 1 ? "" : "s"}
          </span>
        </span>

        <span className="flex shrink-0 items-center gap-3">
          {finals.length > 0 && (
            <span className="hidden rounded-full border border-border bg-background/60 px-2.5 py-1 text-[11px] font-semibold text-muted sm:inline-flex">
              Final available
            </span>
          )}
          <span
            aria-hidden="true"
            className={`grid size-8 place-items-center rounded-full border transition-all ${
              open
                ? "rotate-180 border-accent bg-accent text-accent-ink"
                : "border-border bg-surface text-muted group-hover:border-accent/60 group-hover:text-accent"
            }`}
          >
            <svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m5 7.5 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </span>
      </button>

      <div
        id={contentId}
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-border p-3 sm:p-4">
            {finals.length > 0 && (
              <div className="space-y-3">
                {finals.map((round, index) => (
                  <RoundTable
                    key={`${round.round ?? "final"}-${round.heat ?? index}`}
                    round={round}
                  />
                ))}
              </div>
            )}

            {prelims.length > 0 && (
              <div className={`grid gap-3 ${finals.length > 0 ? "mt-3" : ""} lg:grid-cols-2`}>
                {prelims.map((round, index) => (
                  <RoundTable
                    key={`${round.round ?? "round"}-${round.heat ?? index}`}
                    round={round}
                    compact
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function RoundTable({
  round,
  compact = false,
}: {
  round: TrackRound;
  compact?: boolean;
}) {
  const roundLabel = [round.round, round.heat ? `Heat ${round.heat}` : null]
    .filter(Boolean)
    .join(" · ");

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-background/35">
      <header className="flex items-center justify-between gap-3 border-b border-border bg-surface/70 px-3 py-2.5">
        <div>
          <h3 className="text-sm font-bold capitalize text-foreground">{roundLabel || "Results"}</h3>
          <p className="mt-0.5 text-[11px] text-muted">
            {round.results.length} result{round.results.length === 1 ? "" : "s"}
          </p>
        </div>
        {round.wind && (
          <span className="rounded-full border border-border px-2.5 py-1 font-mono text-[11px] text-muted">
            Wind {round.wind}
          </span>
        )}
      </header>

      <div className="trackside-scrollbar overflow-x-auto">
        <table className={`w-full text-sm ${compact ? "min-w-[520px]" : "min-w-[620px]"}`}>
          <thead className="border-b border-border text-[10px] uppercase tracking-[0.09em] text-muted">
            <tr>
              <th className="px-3 py-2 text-left font-semibold">Place</th>
              <th className="px-3 py-2 text-left font-semibold">Athlete</th>
              <th className="px-3 py-2 text-left font-semibold">Team</th>
              <th className="px-3 py-2 text-right font-semibold">Mark</th>
            </tr>
          </thead>
          <tbody>
            {round.results.map((result) => (
              <tr
                key={`${result.athlete_id}-${result.place ?? result.time ?? result.mark ?? "result"}`}
                className="border-b border-border/70 text-muted transition-colors last:border-b-0 hover:bg-surface/60 hover:text-foreground"
              >
                <td className="px-3 py-2.5 font-mono text-xs">{result.place ?? "—"}</td>
                <td className="px-3 py-2.5">
                  <a
                    href={`/athletes/${result.athlete_id}`}
                    className="font-semibold text-foreground transition-colors hover:text-accent"
                  >
                    {result.athlete_name}
                  </a>
                </td>
                <td className="px-3 py-2.5">
                  <a
                    href={`/teams/${result.team_slug}`}
                    className="transition-colors hover:text-accent"
                  >
                    {result.team_name}
                  </a>
                </td>
                <td className="px-3 py-2.5 text-right font-mono font-bold text-foreground">
                  {result.time || result.mark || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
