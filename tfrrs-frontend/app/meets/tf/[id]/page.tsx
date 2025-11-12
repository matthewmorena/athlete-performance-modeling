import { notFound } from "next/navigation";

async function getMeet(id: string, gender = "m") {
  try {
    const baseUrl =
      typeof window === "undefined"
        ? process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
        : "";
    const res = await fetch(`${baseUrl}/api/meets/${id}?sport=tf&gender=${gender}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch (err) {
    console.error("TF meet fetch failed:", err);
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
  const { gender = "m" } = await searchParams;

  const meet = await getMeet(id, gender);
  if (!meet) return notFound();

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-green-200 rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-semibold text-green-700">{meet.meet_name}</h1>
        <p className="text-gray-700">
          {meet.meet_date} • {meet.meet_location}
        </p>

        <div className="flex gap-3 mt-4">
          <a
            href={`/meets/tf/${id}?gender=m`}
            className={`px-3 py-1.5 rounded-md border text-sm font-medium ${
              gender === "m"
                ? "bg-green-600 text-white border-green-600"
                : "border-green-300 text-green-700 hover:bg-green-50"
            }`}
          >
            Men
          </a>
          <a
            href={`/meets/tf/${id}?gender=f`}
            className={`px-3 py-1.5 rounded-md border text-sm font-medium ${
              gender === "f"
                ? "bg-green-600 text-white border-green-600"
                : "border-green-300 text-green-700 hover:bg-green-50"
            }`}
          >
            Women
          </a>
        </div>
      </div>

      {/* Events */}
      <div className="space-y-6">
        {meet.events.map((event: any) => (
          <div key={event.event_id} className="bg-white border border-green-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-4 py-2 border-b bg-green-100 text-green-800">
              <div className="font-semibold">{event.event_name}</div>
              <div className="text-xs text-gray-600">
                {event.round && <span className="mr-2 capitalize">{event.round}</span>}
                {event.heat && <span>Heat {event.heat}</span>}
                {event.wind && <span className="ml-2">{event.wind}</span>}
              </div>
            </div>

            <table className="w-full text-sm">
              <thead className="bg-green-50 border-b text-green-700">
                <tr>
                  <th className="text-left py-2 px-4">Place</th>
                  <th className="text-left py-2 px-4">Athlete</th>
                  <th className="text-left py-2 px-4">Team</th>
                  <th className="text-right py-2 px-4">Mark</th>
                </tr>
              </thead>
              <tbody>
                {event.results.map((r: any, i: number) => (
                  <tr key={i} className="border-b hover:bg-green-50">
                    <td className="py-2 px-4 text-gray-600">{r.place}</td>
                    <td className="py-2 px-4 text-green-700 hover:underline">
                      <a href={`/athletes/${r.athlete_id}`}>{r.athlete_name}</a>
                    </td>
                    <td className="py-2 px-4 text-green-700 hover:underline">
                      <a href={`/teams/${r.team_slug}`}>{r.team_name}</a>
                    </td>
                    <td className="py-2 px-4 text-right font-medium text-gray-600">{r.time || r.mark}</td>
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
