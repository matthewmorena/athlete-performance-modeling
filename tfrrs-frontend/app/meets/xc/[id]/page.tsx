import { notFound } from "next/navigation";

async function getMeet(id: string) {
  try {
    const baseUrl =
      typeof window === "undefined"
        ? process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
        : "";
    const res = await fetch(`${baseUrl}/api/meets/${id}?sport=xc`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch (err) {
    console.error("XC meet fetch failed:", err);
    return null;
  }
}

export default async function XCMeetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const meet = await getMeet(id);
  if (!meet) return notFound();

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="bg-white border border-green-200 rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-semibold text-green-700">{meet.meet_name}</h1>
        <p className="text-gray-700">
          {meet.meet_date} • {meet.meet_location}
        </p>
      </div>

      <div className="space-y-6">
        {meet.events.map((event: any) => (
          <div key={event.event_id} className="bg-white border border-green-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-4 py-2 border-b bg-green-100 text-green-800 font-semibold">
              {event.event_name}
            </div>
            <table className="w-full text-sm">
              <thead className="bg-green-50 border-b">
                <tr>
                  <th className="text-left py-2 px-4">Place</th>
                  <th className="text-left py-2 px-4">Athlete</th>
                  <th className="text-left py-2 px-4">Team</th>
                  <th className="text-right py-2 px-4">Time</th>
                </tr>
              </thead>
              <tbody>
                {event.results.map((r: any, i: number) => (
                  <tr key={i} className="border-b hover:bg-green-50">
                    <td className="py-2 px-4">{r.place}</td>
                    <td className="py-2 px-4 text-blue-700 hover:underline">
                      <a href={`/athletes/${r.athlete_id}`}>{r.athlete_name}</a>
                    </td>
                    <td className="py-2 px-4 text-blue-700 hover:underline">
                      <a href={`/teams/${r.team_slug}`}>{r.team_name}</a>
                    </td>
                    <td className="py-2 px-4 text-right font-medium">{r.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}
