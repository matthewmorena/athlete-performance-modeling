"use client";
import { useState, useEffect } from "react";

interface XCEventSectionProps {
  event: any;
  forceOpen?: boolean;
}

export default function XCEventSection({ event, forceOpen = false }: XCEventSectionProps) {
  const [open, setOpen] = useState(forceOpen);
  useEffect(() => setOpen(forceOpen), [forceOpen]);

  return (
    <div className="bg-white border border-green-200 rounded-xl shadow-sm overflow-hidden">
      {/* Header bar */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-4 py-3 bg-green-100 hover:bg-green-200 transition-colors text-green-800"
      >
        <div className="text-left font-semibold">{event.event_name}</div>
        <span
          className={`text-lg transition-transform ${
            open ? "rotate-90 text-green-700" : "text-gray-500"
          }`}
        >
          ▶
        </span>
      </button>

      {/* Collapsible body */}
      <div
        className={`transition-[max-height] duration-500 ease-in-out ${
          open ? "max-h-[10000px]" : "max-h-0"
        } overflow-hidden`}
      >
        <XCResultsTable results={event.results} />
      </div>
    </div>
  );
}

/* --- Table for event results --- */
function XCResultsTable({ results }: { results: any[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-green-50 border-b text-gray-700">
          <tr>
            <th className="text-left py-2 px-4">Place</th>
            <th className="text-left py-2 px-4">Athlete</th>
            <th className="text-left py-2 px-4">Team</th>
            <th className="text-right py-2 px-4">Time</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r: any, i: number) => (
            <tr key={i} className="border-b hover:bg-green-50">
              <td className="py-2 px-4 text-gray-700">{r.place}</td>
              <td className="py-2 px-4 text-green-700 hover:underline">
                <a href={`/athletes/${r.athlete_id}`}>{r.athlete_name}</a>
              </td>
              <td className="py-2 px-4 text-green-700 hover:underline">
                <a href={`/teams/${r.team_slug}`}>{r.team_name}</a>
              </td>
              <td className="py-2 px-4 text-right font-medium text-gray-700">{r.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
