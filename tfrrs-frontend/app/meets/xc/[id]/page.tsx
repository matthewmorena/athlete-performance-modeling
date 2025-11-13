import { notFound } from "next/navigation";
import XCEventSection from "@/components/XCEventSection";

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
            <XCEventSection key={event.event_id} event={event} />
        ))}
      </div>
    </div>
  );
}
