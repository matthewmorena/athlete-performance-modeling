import { notFound } from "next/navigation";
import TickerChart from "@/components/TickerChart";

async function getAthlete(id: string) {
  try {
    const res = await fetch(`http://localhost:3000/mock/athlete.json`);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function AthletePage({ params }: { params: { id: string } }) {
  const athlete = await getAthlete(params.id);
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
          <h1 className="text-2xl font-semibold">{athlete.name}</h1>
          <p className="text-gray-600">{athlete.team_name}</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-green-600">
            ${tickerData[tickerData.length - 1].price.toFixed(2)}
          </div>
          <p className="text-xs text-gray-500">Athlete Rating</p>
        </div>
      </div>

      {/* Chart */}
      <TickerChart data={tickerData} />

      {/* Results Table */}
      <div className="bg-white rounded-xl border shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="text-left py-2 px-4">Date</th>
              <th className="text-left py-2 px-4">Meet</th>
              <th className="text-left py-2 px-4">Event</th>
              <th className="text-right py-2 px-4">Result</th>
            </tr>
          </thead>
          <tbody>
            {athlete.results?.map((r: any, idx: number) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{r.date}</td>
                <td className="py-2 px-4">{r.meet_name}</td>
                <td className="py-2 px-4">{r.event}</td>
                <td className="py-2 px-4 text-right font-medium">{r.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
