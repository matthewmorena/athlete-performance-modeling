import { notFound } from "next/navigation";
import type { MeetType, TeamDetail } from "@/lib/types";

async function getTeam(slug: string, sport: MeetType): Promise<TeamDetail | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/teams/${slug}?sport=${sport}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return (await res.json()) as TeamDetail;
  } catch (error) {
    console.error("Team fetch failed:", error);
    return null;
  }
}

export default async function TeamPage({
  params,
  searchParams,
}: {
  params: Promise<{ team_slug: string }>;
  searchParams: Promise<{ sport?: string }>;
}) {
  const { team_slug } = await params;
  const requestedSearchParams = await searchParams;
  const sport: MeetType = requestedSearchParams.sport === "tf" ? "tf" : "xc";
  const team = await getTeam(team_slug, sport);
  if (!team) return notFound();

  const isMensTeam = team_slug.includes("_m_");
  const altGenderSlug = isMensTeam
    ? team_slug.replace("_m_", "_f_")
    : team_slug.replace("_f_", "_m_");
  const discipline = team.sport_type === "xc" ? "Cross Country" : "Track & Field";
  const context = [team.conference, team.region].filter(Boolean).join(" · ");

  return (
    <div className="mx-auto w-full max-w-6xl space-y-5 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <section className="relative overflow-hidden rounded-2xl border border-border bg-panel p-5 shadow-[0_18px_50px_rgb(0_0_0/0.22)] sm:p-6">
        <div className="absolute inset-x-0 top-0 h-1 bg-accent" />
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
              Team profile
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.035em] text-foreground sm:text-4xl">
              {team.team_name}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted">
              <span className="rounded-full border border-border bg-surface px-3 py-1">
                {isMensTeam ? "Men’s" : "Women’s"} {discipline}
              </span>
              {context && (
                <span className="rounded-full border border-border px-3 py-1">{context}</span>
              )}
              <span className="rounded-full border border-border px-3 py-1">
                {team.roster.length} athlete{team.roster.length === 1 ? "" : "s"}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <a
              href={`/teams/${altGenderSlug}?sport=${sport}`}
              className="rounded-xl border border-border px-4 py-2 text-center text-sm font-bold text-foreground transition-colors hover:border-accent/60 hover:text-accent"
            >
              View {isMensTeam ? "women’s" : "men’s"} team
            </a>

            <nav
              className="inline-flex w-fit rounded-xl border border-border bg-background/60 p-1"
              aria-label="Team sport"
            >
              <a
                href={`/teams/${team_slug}?sport=xc`}
                aria-current={sport === "xc" ? "page" : undefined}
                className={`rounded-lg px-4 py-2 text-sm font-bold transition-colors ${
                  sport === "xc"
                    ? "bg-accent text-accent-ink"
                    : "text-muted hover:bg-surface hover:text-foreground"
                }`}
              >
                XC
              </a>
              <a
                href={`/teams/${team_slug}?sport=tf`}
                aria-current={sport === "tf" ? "page" : undefined}
                className={`rounded-lg px-4 py-2 text-sm font-bold transition-colors ${
                  sport === "tf"
                    ? "bg-accent text-accent-ink"
                    : "text-muted hover:bg-surface hover:text-foreground"
                }`}
              >
                Track &amp; field
              </a>
            </nav>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-border bg-panel shadow-[0_18px_50px_rgb(0_0_0/0.18)]">
        <header className="flex items-end justify-between gap-4 border-b border-border px-4 py-4 sm:px-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
              Active squad
            </p>
            <h2 className="mt-1 text-lg font-bold text-foreground">Roster</h2>
          </div>
          <span className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted">
            {discipline}
          </span>
        </header>

        <div className="trackside-scrollbar overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead className="border-b border-border bg-surface/70 text-[11px] uppercase tracking-[0.09em] text-muted">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Athlete</th>
                <th className="px-4 py-3 text-left font-semibold">Year</th>
              </tr>
            </thead>
            <tbody>
              {team.roster.map((athlete) => (
                <tr
                  key={athlete.athlete_id}
                  className="border-b border-border/80 text-muted transition-colors last:border-b-0 hover:bg-surface/70 hover:text-foreground"
                >
                  <td className="px-4 py-3">
                    <a
                      href={`/athletes/${athlete.athlete_id}`}
                      className="font-semibold text-foreground transition-colors hover:text-accent"
                    >
                      {athlete.athlete_name}
                    </a>
                  </td>
                  <td className="px-4 py-3">{athlete.year ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
