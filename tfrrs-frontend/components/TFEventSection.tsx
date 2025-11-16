"use client";
import { useState, useEffect } from "react";

interface TFEventSectionProps {
  eventGroup: {
    event_id: string;
    event_name: string;
    rounds: any[];
  };
  forceOpen?: boolean;
}

export default function TFEventSection({ eventGroup, forceOpen = false }: TFEventSectionProps) {
  const [open, setOpen] = useState(forceOpen);
  useEffect(() => setOpen(forceOpen), [forceOpen]);

  const finals = eventGroup.rounds.filter((r) =>
    r.round?.toLowerCase().includes("final")
  );
  const prelims = eventGroup.rounds.filter(
    (r) => !r.round?.toLowerCase().includes("final")
  );

  return (
    <div className="bg-white border border-green-200 rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-4 py-3 bg-green-100 hover:bg-green-200 transition-colors text-green-800"
      >
        <div className="text-left font-semibold">{eventGroup.event_name}</div>
        <span
          className={`text-lg transition-transform ${
            open ? "rotate-90 text-green-700" : "text-gray-500"
          }`}
        >
          ▶
        </span>
      </button>

      {/* Body */}
      <div
        className={`transition-[max-height] duration-500 ease-in-out ${
          open ? "max-h-[5000px]" : "max-h-0"
        } overflow-hidden`}
      >
        {/* Finals */}
        {finals.length > 0 && (
          <div className="p-4 pt-0">
            {finals.map((round, i) => (
              <RoundTable key={i} round={round} />
            ))}
          </div>
        )}

        {/* Prelims grid */}
        {prelims.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            {prelims.map((round, i) => (
              <RoundTable key={i} round={round} compact />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

/* --- Subcomponent for each round/heat --- */
function RoundTable({ round, compact = false }: { round: any; compact?: boolean }) {
  return (
    <div className={`border border-green-200 rounded-lg shadow-sm ${compact ? "" : "mb-4"}`}>
      <div className="px-3 py-2 bg-green-50 border-b text-green-800 text-sm font-semibold">
        {round.round && <span className="capitalize">{round.round}</span>}{" "}
        {round.heat && <span>Heat {round.heat}</span>}{" "}
        {round.wind && <span className="text-gray-700 text-xs ml-1">{round.wind}</span>}
      </div>
      <table className="w-full text-sm">
        <thead className="border-b bg-green-50 text-gray-700">
          <tr>
            <th className="text-left py-1 px-3">Pl</th>
            <th className="text-left py-1 px-3">Athlete</th>
            <th className="text-left py-1 px-3">Team</th>
            <th className="text-right py-1 px-3">Mark</th>
          </tr>
        </thead>
        <tbody>
          {round.results.map((r: any, idx: number) => (
            <tr key={idx} className="border-b hover:bg-green-50">
              <td className="py-1 px-3 text-gray-700">{r.place}</td>
              <td className="py-1 px-3 text-green-700 hover:underline">
                <a href={`/athletes/${r.athlete_id}`}>{r.athlete_name}</a>
              </td>
              <td className="py-1 px-3 text-green-700 hover:underline">
                <a href={`/teams/${r.team_slug}`}>{r.team_name}</a>
              </td>
              <td className="py-1 px-3 text-right font-medium text-gray-700">{r.time || r.mark}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
