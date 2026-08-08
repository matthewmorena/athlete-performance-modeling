import { isSupportedScoringEvent, scorePerformance } from "@/lib/points";
import { formatCompactMeetDate, sortByDateDesc } from "@/lib/time";
import type {
  AthleteDetail,
  AthletePerformanceResult,
  FeaturedAthlete,
  FeaturedEventGroup,
  FeaturedRatingPoint,
} from "@/lib/types";

export const FEATURED_ATHLETE_IDS = [
  "8672366",
  "8232893",
  "8709994",
  "8996681",
  "8675923",
  "8676762",
] as const;

const RECENT_SCORABLE_RESULT_LIMIT = 12;

function initialsFor(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "—";
}

function classifyEvent(event: string): FeaturedEventGroup {
  const normalized = event.toLowerCase().replace(/\s+/g, "");

  if (/pv|polevault|hj|highjump|lj|longjump|tj|triplejump/.test(normalized)) {
    return "Jumps";
  }

  if (/sp|shotput|dt|discus|ht|hammer|wt|weightthrow|jt|javelin/.test(normalized)) {
    return "Throws";
  }

  if (/800|1000|1500|1600|mile|3000|3200|5000|5k|6k|8k|10k|steeple|3000s|2000s/.test(normalized)) {
    return "Distance";
  }

  if (/60|100|200|300|400|hurdle|55h|60h|100h|110h|300h|400h|4x/.test(normalized)) {
    return "Sprints";
  }

  return "Other";
}

function normalizeGender(value: string): "male" | "female" | null {
  const normalized = value.trim().toLowerCase();
  if (normalized === "f" || normalized.includes("female") || normalized.includes("women")) {
    return "female";
  }
  if (normalized === "m" || normalized.includes("male") || normalized.includes("men")) {
    return "male";
  }
  return null;
}

function formatPlace(value: AthletePerformanceResult["place"]): string {
  if (value === null || value === undefined || value === "") return "—";
  const text = String(value);
  return /(?:st|nd|rd|th)$/i.test(text) ? text : `${text}`;
}

async function scoreRecentResults(
  athlete: AthleteDetail,
  sortedResults: AthletePerformanceResult[],
): Promise<FeaturedRatingPoint[]> {
  const gender = normalizeGender(athlete.gender);
  if (!gender) return [];

  const eligibleResults = sortedResults
    .filter(
      (result) =>
        typeof result.mark_int === "number" &&
        result.mark_int > 0 &&
        isSupportedScoringEvent(result.event_name, result.meet_type),
    )
    .slice(0, RECENT_SCORABLE_RESULT_LIMIT);

  const scoredDescending = await Promise.all(
    eligibleResults.map(async (result) => {
      const { points } = await scorePerformance({
        event: result.event_name,
        gender,
        markSeconds: result.mark_int as number,
        meetType: result.meet_type,
      });

      return {
        date: result.date,
        dateLabel: formatCompactMeetDate(result.date),
        rating: points,
        label: `${result.event_name} • ${result.mark} • ${result.meet_name}`,
      } satisfies FeaturedRatingPoint;
    }),
  );

  return scoredDescending.reverse();
}

export async function buildFeaturedAthlete(
  id: string,
  athlete: AthleteDetail,
): Promise<FeaturedAthlete> {
  const sortedResults = sortByDateDesc(athlete.results ?? []);
  const latestResult = sortedResults[0];
  const history = await scoreRecentResults(athlete, sortedResults);
  const latestRating = history.at(-1)?.rating ?? null;
  const previousRating = history.at(-2)?.rating ?? null;

  return {
    id,
    name: athlete.athlete_name,
    initials: initialsFor(athlete.athlete_name),
    school: athlete.current_team_name,
    year: athlete.class_year || "Class not listed",
    event: latestResult?.event_name || "No recent event",
    group: classifyEvent(latestResult?.event_name || ""),
    rating: latestRating,
    delta:
      latestRating !== null && previousRating !== null
        ? latestRating - previousRating
        : null,
    place: latestResult ? formatPlace(latestResult.place) : "—",
    mark: latestResult?.mark || "—",
    meet: latestResult?.meet_name || "No results available",
    resultDate: latestResult?.date || "—",
    scoredResults: history.length,
    totalResults: sortedResults.length,
    history,
    sourceUrl: `https://www.tfrrs.org/athletes/${id}`,
  };
}
