import { notFound } from "next/navigation";
import TickerChart from "@/components/TickerChart";

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

  const tickerData = Array.from({ length: 10 }, (_, i) => ({
    date: `Week ${i + 1}`,
    price: Math.round(100 + Math.random() * 20),
  }));

  return (
    <div className="space-y-8">
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
          <div className="text-3xl font-bold text-green-700">
            {tickerData[tickerData.length - 1].price.toFixed(2)}
          </div>
          <p className="text-xs text-gray-500">Athlete Rating</p>
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
                <td className="py-2 px-4">{r.event}</td>
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
