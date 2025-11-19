import { notFound } from "next/navigation";
import TickerChart from "@/components/TickerChart";
import { scorePerformance } from "@/lib/points";
import { sortByDateDesc, formatSeconds } from "@/lib/time";

async function getAthlete(id: string) {
  try {
    // Construct an absolute URL for server-side fetches
    const baseUrl =
      typeof window === "undefined"
        ? process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
        : "";

    const res = await fetch(`${baseUrl}/api/athletes/${id}`, {
      next: { revalidate: 60 },
    });

    console.log("Response status:", res.status);
    if (!res.ok) return null;

    const data = await res.json();
    console.log("Fetched athlete:", data);
    return data;
  } catch (err) {
    console.error("Fetch failed:", err);
    return null;
  }
}

export default async function AthletePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // ✅ unwrap the params Promise
  const athlete = await getAthlete(id);
  if (!athlete) return notFound();

// Build points series from results with mark_int
  const results = athlete.results;

  const series = await Promise.all(
    results
      .filter((r: any) => typeof r.mark_int === "number" && r.mark_int > 0)
      .map(async (r: any) => {
        const { points, mode } = await scorePerformance({
          event: r.event_name,
          gender: athlete.gender.toLowerCase() as "male" | "female",
          markSeconds: r.mark_int,
          meetType: r.meet_type,
        });
        return {
          date: r.date,
          event: r.event_name,
          points,
          mode,
          label: `${r.event_name} • ${formatSeconds(r.mark_int)} • ${r.meet_name}`,
        };
      })
  );

  // Recharts input: latest first or reverse for chronological
  const tickerData = [...series].reverse().map((d) => ({
    date: d.date,
    rating: d.points, // "rating" field drives the existing chart
    label: d.label,
  }));

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{athlete.athlete_name}</h1>
          <p className="text-gray-600">
            {athlete.class_year && `${athlete.class_year} • `}
            <a className="text-green-700 hover:underline" href={`/teams/${athlete.current_team_slug}`}>{athlete.current_team_name}</a>
          </p>
        </div>
        <div className="text-right">
          {tickerData.length ? (
            <div>
              <div className="text-3xl font-bold text-green-600">
                {tickerData.at(-1)?.rating.toFixed(2)}
              </div>
              <p className="text-xs text-gray-500">Athlete Rating</p>
            </div>
          ) : (
            <div className="text-gray-500 text-sm italic">No timed results yet</div>
          )}
        </div>
      </div>

      {/* Chart */}
      <TickerChart data={tickerData} />
      <div>
        <h2 className="text-l font-semibold">Results</h2>
      </div>
      {/* Results Table */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm text-gray-500">
          <thead className="border-b  bg-gray-50">
            <tr>
              <th className="text-left py-2 px-4">Date</th>
              <th className="text-left py-2 px-4">Meet</th>
              <th className="text-left py-2 px-4">Event</th>
              <th className="text-right py-2 px-4">Mark</th>
              <th className="text-right py-2 px-4">Place</th>
              <th className="text-right py-2 px-4">Round</th>
            </tr>
          </thead>
          <tbody>
            {athlete.results?.map((r: any, idx: number) => (
              <tr key={idx} className="border-b hover:bg-green-100">
                <td className="py-2 px-4">{r.date}</td>
                <td className="py-2 px-4">
                  <a
                    href={`/meets/${r.meet_type}/${r.meet_id}`}
                    className="text-green-700 hover:underline"
                  >
                    {r.meet_name}
                  </a>
                </td>
                <td className="py-2 px-4">{r.event_name}</td>
                <td className="py-2 px-4 text-right font-medium">{r.mark}</td>
                <td className="py-2 px-4 text-right">{r.place}</td>
                <td className="py-2 px-4 text-right">
                  {r.round ? r.round : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
