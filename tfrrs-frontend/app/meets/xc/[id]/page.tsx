import { notFound } from "next/navigation";
import XCEventSection from "@/components/XCEventSection";
import type { CrossCountryMeet } from "@/lib/types";

async function getMeet(id: string): Promise<CrossCountryMeet | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/meets/${id}?sport=xc`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return (await res.json()) as CrossCountryMeet;
  } catch (error) {
    console.error("XC meet fetch failed:", error);
    return null;
  }
}

export default async function XCMeetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const meet = await getMeet(id);
  if (!meet) return notFound();

  return (
    <div className="mx-auto w-full max-w-6xl space-y-5 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <section className="relative overflow-hidden rounded-2xl border border-border bg-panel p-5 shadow-[0_18px_50px_rgb(0_0_0/0.22)] sm:p-6">
        <div className="absolute inset-x-0 top-0 h-1 bg-accent" />
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
          Cross country meet
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
            {meet.events.length} race{meet.events.length === 1 ? "" : "s"}
          </span>
        </div>
      </section>

      <section aria-labelledby="meet-races-heading">
        <div className="mb-3 flex items-center justify-between gap-4 px-1">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
              Official results
            </p>
            <h2 id="meet-races-heading" className="mt-1 text-lg font-bold text-foreground">
              Races
            </h2>
          </div>
          <span className="text-xs text-muted">Select a race to expand</span>
        </div>

        <div className="space-y-3">
          {meet.events.map((event) => (
            <XCEventSection key={event.event_id} event={event} />
          ))}
        </div>
      </section>
    </div>
  );
}
