// lib/time.ts
export function formatSeconds(sec: number) {
  if (!isFinite(sec)) return "—";
  const s = Math.floor(sec % 60);
  const m = Math.floor((sec / 60) % 60);
  const h = Math.floor(sec / 3600);
  const ms = Math.round((sec - Math.floor(sec)) * 10); // tenths
  const mm = m.toString();
  const ss = s.toString().padStart(2, "0");
  const tenths = ms > 0 ? `.${ms}` : "";
  return h > 0 ? `${h}:${mm.padStart(2, "0")}:${ss}${tenths}` : `${mm}:${ss}${tenths}`;
}

export function sortByDateDesc(results: any[]) {
  // Your date strings look like "Nov 14, 2025"
  return [...results].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
