import { notFound } from "next/navigation";
import { groupTrackEvents } from "@/lib/groupEvents";
import TFEventSection from "@/components/TFEventSection";

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

  const groupedEvents = groupTrackEvents(meet.events);

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
        {groupedEvents.map((group) => (
            <TFEventSection key={group.event_id} eventGroup={group} />
        ))}
      </div>
    </div>
  );
}
