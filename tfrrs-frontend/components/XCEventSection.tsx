"use client";

import { useId, useState } from "react";
import type { CrossCountryEvent, CrossCountryResult } from "@/lib/types";

interface XCEventSectionProps {
  event: CrossCountryEvent;
  forceOpen?: boolean;
}

export default function XCEventSection({
  event,
  forceOpen = false,
}: XCEventSectionProps) {
  const [open, setOpen] = useState(forceOpen);
  const contentId = useId();

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
            {event.event_name}
          </span>
          <span className="mt-1 block text-xs text-muted">
            {event.results.length} finisher{event.results.length === 1 ? "" : "s"}
          </span>
        </span>

        <span
          aria-hidden="true"
          className={`grid size-8 shrink-0 place-items-center rounded-full border transition-all ${
            open
              ? "rotate-180 border-accent bg-accent text-accent-ink"
              : "border-border bg-surface text-muted group-hover:border-accent/60 group-hover:text-accent"
          }`}
        >
          <svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m5 7.5 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>

      <div
        id={contentId}
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-border">
            <XCResultsTable results={event.results} />
          </div>
        </div>
      </div>
    </article>
  );
}

function XCResultsTable({ results }: { results: CrossCountryResult[] }) {
  return (
    <div className="trackside-scrollbar overflow-x-auto">
      <table className="w-full min-w-[620px] text-sm">
        <thead className="border-b border-border bg-surface/70 text-[10px] uppercase tracking-[0.09em] text-muted">
          <tr>
            <th className="px-4 py-3 text-left font-semibold">Place</th>
            <th className="px-4 py-3 text-left font-semibold">Athlete</th>
            <th className="px-4 py-3 text-left font-semibold">Team</th>
            <th className="px-4 py-3 text-right font-semibold">Time</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result) => (
            <tr
              key={`${result.athlete_id}-${result.place ?? result.time}`}
              className="border-b border-border/70 text-muted transition-colors last:border-b-0 hover:bg-surface/60 hover:text-foreground"
            >
              <td className="px-4 py-3 font-mono text-xs">{result.place ?? "—"}</td>
              <td className="px-4 py-3">
                <a
                  href={`/athletes/${result.athlete_id}`}
                  className="font-semibold text-foreground transition-colors hover:text-accent"
                >
                  {result.athlete_name}
                </a>
              </td>
              <td className="px-4 py-3">
                <a
                  href={`/teams/${result.team_slug}`}
                  className="transition-colors hover:text-accent"
                >
                  {result.team_name}
                </a>
              </td>
              <td className="px-4 py-3 text-right font-mono font-bold text-foreground">
                {result.time}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
