import { notFound } from "next/navigation";
import TickerChart from "@/components/TickerChart";
import { isSupportedScoringEvent, scorePerformance } from "@/lib/points";
import { formatSeconds, sortByDateDesc } from "@/lib/time";
import type { AthleteDetail } from "@/lib/types";

async function getAthlete(id: string): Promise<AthleteDetail | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/athletes/${id}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return null;
    return (await res.json()) as AthleteDetail;
  } catch (error) {
    console.error("Athlete fetch failed:", error);
    return null;
  }
}

export default async function AthletePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const athlete = await getAthlete(id);
  if (!athlete) return notFound();

  const results = sortByDateDesc(athlete.results ?? []);
  const normalizedGender = athlete.gender.toLowerCase();
  const gender = normalizedGender === "female" ? "female" : "male";

  const series = await Promise.all(
    results
      .filter(
        (result) =>
          typeof result.mark_int === "number" &&
          result.mark_int > 0 &&
          isSupportedScoringEvent(result.event_name, result.meet_type),
      )
      .map(async (result) => {
        const markSeconds = result.mark_int as number;
        const { points, mode } = await scorePerformance({
          event: result.event_name,
          gender,
          markSeconds,
          meetType: result.meet_type,
        });

        return {
          date: result.date,
          event: result.event_name,
          points,
          mode,
          label: `${result.event_name} • ${formatSeconds(markSeconds)} • ${result.meet_name}`,
        };
      }),
  );

  const tickerData = [...series].reverse().map((item) => ({
    date: item.date,
    rating: item.points,
    label: item.label,
  }));
  const latestRating = tickerData.at(-1)?.rating;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-5 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <section className="relative overflow-hidden rounded-2xl border border-border bg-panel p-5 shadow-[0_18px_50px_rgb(0_0_0/0.22)] sm:p-6">
        <div className="absolute inset-x-0 top-0 h-1 bg-accent" />
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
              Athlete profile
            </p>
            <h1 className="mt-2 truncate text-3xl font-extrabold tracking-[-0.035em] text-foreground sm:text-4xl">
              {athlete.athlete_name}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted">
              {athlete.class_year && (
                <span className="rounded-full border border-border bg-surface px-3 py-1">
                  {athlete.class_year}
                </span>
              )}
              <a
                className="rounded-full border border-border px-3 py-1 font-semibold text-foreground transition-colors hover:border-accent/60 hover:text-accent"
                href={`/teams/${athlete.current_team_slug}`}
              >
                {athlete.current_team_name}
              </a>
              <span className="rounded-full border border-border px-3 py-1 capitalize">
                {athlete.gender}
              </span>
            </div>
          </div>

          <div className="shrink-0 rounded-2xl border border-border bg-background/60 px-5 py-4 sm:text-right">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
              Current rating
            </p>
            {latestRating !== undefined ? (
              <strong className="mt-1 block font-mono text-3xl text-accent">
                {latestRating.toFixed(2)}
              </strong>
            ) : (
              <span className="mt-2 block text-sm text-muted">Not yet rated</span>
            )}
            <p className="mt-1 text-xs text-muted">
              {series.length} scored performance{series.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>
      </section>

      <TickerChart data={tickerData} />

      <section className="overflow-hidden rounded-2xl border border-border bg-panel shadow-[0_18px_50px_rgb(0_0_0/0.18)]">
        <header className="flex items-end justify-between gap-4 border-b border-border px-4 py-4 sm:px-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
              Competition history
            </p>
            <h2 className="mt-1 text-lg font-bold text-foreground">Results</h2>
          </div>
          <span className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted">
            {results.length} result{results.length === 1 ? "" : "s"}
          </span>
        </header>

        <div className="trackside-scrollbar overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="border-b border-border bg-surface/70 text-[11px] uppercase tracking-[0.09em] text-muted">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Date</th>
                <th className="px-4 py-3 text-left font-semibold">Meet</th>
                <th className="px-4 py-3 text-left font-semibold">Event</th>
                <th className="px-4 py-3 text-right font-semibold">Mark</th>
                <th className="px-4 py-3 text-right font-semibold">Place</th>
                <th className="px-4 py-3 text-right font-semibold">Round</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr
                  key={`${result.meet_id}-${result.event_name}-${result.round ?? index}`}
                  className="border-b border-border/80 text-muted transition-colors last:border-b-0 hover:bg-surface/70 hover:text-foreground"
                >
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs">{result.date}</td>
                  <td className="max-w-64 px-4 py-3">
                    <a
                      href={`/meets/${result.meet_type}/${result.meet_id}`}
                      className="font-semibold text-foreground transition-colors hover:text-accent"
                    >
                      {result.meet_name}
                    </a>
                  </td>
                  <td className="px-4 py-3">{result.event_name}</td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-foreground">
                    {result.mark}
                  </td>
                  <td className="px-4 py-3 text-right">{result.place ?? "—"}</td>
                  <td className="px-4 py-3 text-right capitalize">{result.round || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
