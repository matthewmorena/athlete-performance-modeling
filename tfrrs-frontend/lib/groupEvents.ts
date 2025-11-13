export function groupTrackEvents(events: any[]) {
  const groups: Record<string, any[]> = {};
  for (const ev of events) {
    if (!groups[ev.event_id]) groups[ev.event_id] = [];
    groups[ev.event_id].push(ev);
  }
  return Object.entries(groups).map(([event_id, rounds]) => ({
    event_id,
    event_name: rounds[0].event_name,
    rounds,
  }));
}
