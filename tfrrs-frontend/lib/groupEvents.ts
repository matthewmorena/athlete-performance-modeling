import type { TrackEventGroup, TrackRound } from "@/lib/types";

export function groupTrackEvents(events: TrackRound[]): TrackEventGroup[] {
  const groups: Record<string, TrackRound[]> = {};

  for (const event of events) {
    const eventId = String(event.event_id);
    const rounds = groups[eventId] ?? [];
    rounds.push(event);
    groups[eventId] = rounds;
  }

  return Object.entries(groups).map(([eventId, rounds]) => ({
    event_id: eventId,
    event_name: rounds[0].event_name,
    rounds,
  }));
}
