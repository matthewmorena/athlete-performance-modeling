import { notFound } from "next/navigation";
import { groupTrackEvents } from "@/lib/groupEvents";
import TFEventSection from "@/components/TFEventSection";
import type { TrackMeet } from "@/lib/types";

async function getMeet(id: string, gender: string): Promise<TrackMeet | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/meets/${id}?sport=tf&gender=${gender}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return (await res.json()) as TrackMeet;
  } catch (error) {
    console.error("TF meet fetch failed:", error);
    return null;
  }
}

export default async function TFMeetPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ gender?: string }>;
}) {
  const { id } = await params;
  const requestedSearchParams = await searchParams;
  const gender = requestedSearchParams.gender === "f" ? "f" : "m";

  const meet = await getMeet(id, gender);
  if (!meet) return notFound();

  const groupedEvents = groupTrackEvents(meet.events);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-5 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <section className="relative overflow-hidden rounded-2xl border border-border bg-panel p-5 shadow-[0_18px_50px_rgb(0_0_0/0.22)] sm:p-6">
        <div className="absolute inset-x-0 top-0 h-1 bg-accent" />
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
              Track &amp; field meet
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.035em] text-foreground sm:text-4xl">
              {meet.meet_name}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted">
              <span className="rounded-full border border-border bg-surface px-3 py-1">
                {meet.meet_date}
              </span>
              <span className="rounded-full border border-border px-3 py-1">
                {meet.meet_location}
              </span>
              <span className="rounded-full border border-border px-3 py-1">
                {groupedEvents.length} event{groupedEvents.length === 1 ? "" : "s"}
              </span>
            </div>
          </div>

          <nav
            className="inline-flex w-fit rounded-xl border border-border bg-background/60 p-1"
            aria-label="Results division"
          >
            <a
              href={`/meets/tf/${id}?gender=m`}
              aria-current={gender === "m" ? "page" : undefined}
              className={`rounded-lg px-4 py-2 text-sm font-bold transition-colors ${
                gender === "m"
                  ? "bg-accent text-accent-ink"
                  : "text-muted hover:bg-surface hover:text-foreground"
              }`}
            >
              Men
            </a>
            <a
              href={`/meets/tf/${id}?gender=f`}
              aria-current={gender === "f" ? "page" : undefined}
              className={`rounded-lg px-4 py-2 text-sm font-bold transition-colors ${
                gender === "f"
                  ? "bg-accent text-accent-ink"
                  : "text-muted hover:bg-surface hover:text-foreground"
              }`}
            >
              Women
            </a>
          </nav>
        </div>
      </section>

      <section aria-labelledby="meet-events-heading">
        <div className="mb-3 flex items-center justify-between gap-4 px-1">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
              Official results
            </p>
            <h2 id="meet-events-heading" className="mt-1 text-lg font-bold text-foreground">
              Events
            </h2>
          </div>
          <span className="text-xs text-muted">Select an event to expand</span>
        </div>

        <div className="space-y-3">
          {groupedEvents.map((group) => (
            <TFEventSection key={group.event_id} eventGroup={group} />
          ))}
        </div>
      </section>
    </div>
  );
}
