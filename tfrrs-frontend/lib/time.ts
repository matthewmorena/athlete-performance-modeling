import type { DatedResult } from "@/lib/types";

const MONTH_INDEX: Record<string, number> = {
  jan: 0,
  january: 0,
  feb: 1,
  february: 1,
  mar: 2,
  march: 2,
  apr: 3,
  april: 3,
  may: 4,
  jun: 5,
  june: 5,
  jul: 6,
  july: 6,
  aug: 7,
  august: 7,
  sep: 8,
  sept: 8,
  september: 8,
  oct: 9,
  october: 9,
  nov: 10,
  november: 10,
  dec: 11,
  december: 11,
};

const MONTH_PATTERN =
  /\b(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sept|sep|oct|nov|dec)\b/gi;

export function formatSeconds(sec: number) {
  if (!isFinite(sec)) return "—";
  const s = Math.floor(sec % 60);
  const m = Math.floor((sec / 60) % 60);
  const h = Math.floor(sec / 3600);
  const ms = Math.round((sec - Math.floor(sec)) * 10); // tenths
  const mm = m.toString();
  const ss = s.toString().padStart(2, "0");
  const tenths = ms > 0 ? `.${ms}` : "";
  return h > 0 ? `${h}:${mm.padStart(2, "0")}:${ss}${tenths}` : `${mm}:${ss}${tenths}`;
}

/**
 * TFRRS meet dates frequently arrive as ranges such as "Feb 27-28, 2026",
 * "Feb 28-Mar 1, 2026", or "Jun 5- 8, 2024". JavaScript's Date parser does
 * not reliably understand those values, so use the final day of the meet as
 * the sortable date. ISO dates are supported as well.
 */
export function parseMeetDate(value: string): number | null {
  const normalized = value
    .trim()
    .replace(/[–—]/g, "-")
    .replace(/\s+/g, " ");

  if (!normalized) return null;

  const isoMatch = normalized.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    return Date.UTC(Number(year), Number(month) - 1, Number(day));
  }

  const yearMatch = normalized.match(/\b(\d{4})\b(?!.*\b\d{4}\b)/);
  const monthMatches = [...normalized.matchAll(MONTH_PATTERN)];
  const dayMatches = [...normalized.matchAll(/\b(\d{1,2})\b/g)];

  if (yearMatch && monthMatches.length > 0 && dayMatches.length > 0) {
    const year = Number(yearMatch[1]);
    const monthToken = monthMatches.at(-1)?.[1].toLowerCase();
    const month = monthToken ? MONTH_INDEX[monthToken] : undefined;

    const candidateDays = dayMatches
      .map((match) => Number(match[1]))
      .filter((day) => day >= 1 && day <= 31);
    const day = candidateDays.at(-1);

    if (month !== undefined && day !== undefined) {
      return Date.UTC(year, month, day);
    }
  }

  const fallback = Date.parse(normalized);
  return Number.isNaN(fallback) ? null : fallback;
}

export function formatCompactMeetDate(value: string): string {
  const timestamp = parseMeetDate(value);
  if (timestamp === null) return value;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(timestamp));
}

export function sortByDateDesc<T extends DatedResult>(results: T[]): T[] {
  return [...results].sort((a, b) => {
    const aTime = parseMeetDate(a.date);
    const bTime = parseMeetDate(b.date);

    if (aTime === null && bTime === null) return 0;
    if (aTime === null) return 1;
    if (bTime === null) return -1;
    return bTime - aTime;
  });
}
