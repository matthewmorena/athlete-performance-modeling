// lib/points.ts
type Gender = "male" | "female";
type EventKey = string; // e.g. "1500", "5000", "10k", "mile", "8k-xc", "10k-xc"

export type ScoringMode = "table" | "formula" | "fallback";

const FORMULAS: Partial<Record<`${EventKey}_${Gender}`, { a: number; b: number; c: number }>> = {
  // --- 100 m ---
  "100_male": { a: 7026, b: -820, c: 23.9 },
  "100_female": { a: 4810, b: -438, c: 9.94 },

  // --- 200 m ---
  "200_male": { a: 6495, b: -369, c: 5.28 },
  "200_female": { a: 4663, b: -206, c: 2.28 },

  // --- 400 m ---
  "400_male": { a: 6326, b: -159, c: 1.0 },
  "400_female": { a: 4064, b: -74.1, c: 0.339 },

  // --- 800 m ---
  "800_male": { a: 6535, b: -71.6, c: 0.196 },
  "800_female": { a: 4299, b: -34.4, c: 0.0689 },

  // --- 1500 m ---
  "1500_male": { a: 6036, b: -31.4, c: 0.0408 },
  "1500_female": { a: 3907, b: -14.5, c: 0.0134 },

  // --- 3000 m ---
  "3000_male": { a: 5751, b: -13.7, c: 0.00815 },
  "3000_female": { a: 3652, b: -6.08, c: 0.00253 },

  // --- 5000 m ---
  "5000_male": { a: 5764, b: -8.01, c: 0.00278 },
  "5000_female": { a: 3565, b: -3.4, c: 0.00081 },

  // --- 10 000 m ---
  "10000_male": { a: 5200, b: -3.3, c: 0.000524 },
  "10000_female": { a: 3467, b: -1.54, c: 0.000171 },

  // --- Hurdles & Steeple ---
  "110h_male": { a: 5118, b: -398, c: 7.77 },
  "100h_female": { a: 3572, b: -238, c: 3.94 },
  "400h_male": { a: 4972, b: -104, c: 0.544 },
  "400h_female": { a: 3526, b: -54.3, c: 0.209 },
  "3000sc_male": { a: 4473, b: -8.74, c: 0.00426 },
  "3000sc_female": { a: 3017, b: -4.0, c: 0.00132 },
};

// Conversion factors → seconds = seconds * factor (or seconds / divisor)
const CONVERSIONS: Record<string, number> = {
  // 100 m family
  "55m->100m": 1.65,
  "60m->100m": 1.54,

  // 200 m family
  "300->200m": 1 / 1.6,

  // 400 m family
  "500->400m": 1 / 1.32,

  // 800 m family
  "600->800m": 1.38,
  "1000->800m": 1 / 1.32,

  // 1500 m family
  "1600->1500m": 1 / 1.0737,
  "mile->1500m": 1 / 1.08,

  // 3000 m family
  "3200->3000m": 1 / 1.0737,
  "2mile->3000m": 1 / 1.08,
  "4k-xc->3000m": 1 / 1.44,

  // 5000 m family
  "5k-xc->5000m": 1 / 1.044,
  "6k-xc->5000m": 1 / 1.29,
  "4m-xc->5000m": 1 / 1.33,

  // 10 000 m family
  "8k-xc->10000m": 1 / 0.81,
  "10k-xc->10000m": 1 / 1.027,

  // hurdles / steeple
  "55h->110h": 1.97,
  "60h->110h": 1.83,
  "55h->100h": 1.74,
  "60h->100h": 1.62,
  "300h->400h": 1.36,
  "2000sc->3000sc": 1.55,
};



// Simple map from raw event strings → normalized keys we’ll use for tables/formulas.
export function normalizeEvent(raw: string, meetType?: "xc" | "tf"): EventKey {
  const s = raw.trim().toLowerCase();
  const compact = s
    .replace(/meters?/g, "m")
    .replace(/\s+/g, "")
    .replace(/,/g, "");

  // Relays use team marks and should not be treated as individual scores.
  if (compact.includes("x") || compact.includes("relay") || compact === "dmr") {
    return "relay";
  }

  // Hurdles and steeplechase must be checked before their flat-distance forms.
  if (compact.includes("3000s") || compact.includes("3000sc")) return "3000sc";
  if (compact.includes("2000s") || compact.includes("2000sc")) return "2000sc";
  if (compact.includes("400h")) return "400h";
  if (compact.includes("110h")) return "110h";
  if (compact.includes("100h")) return "100h";
  if (compact.includes("60h")) return "60h";
  if (compact.includes("55h")) return "55h";
  if (compact.includes("300h")) return "300h";

  if (/^55m?$/.test(compact)) return "55m";
  if (/^60m?$/.test(compact)) return "60m";
  if (/^100m?$/.test(compact)) return "100";
  if (/^200m?$/.test(compact)) return "200";
  if (/^300m?$/.test(compact)) return "300";
  if (/^400m?$/.test(compact)) return "400";
  if (/^500m?$/.test(compact)) return "500";
  if (/^600m?$/.test(compact)) return "600";
  if (/^800m?$/.test(compact)) return "800";

  // Check 10,000m before 1,000m. After punctuation is removed,
  // "10,000" becomes "10000", which also contains the substring "1000".
  if (/^10000m?$/.test(compact) || compact === "10k") {
    return meetType === "xc" ? "10k-xc" : "10000";
  }

  if (/^1000m?$/.test(compact)) return "1000";
  if (/^(2miles?|twomiles?)$/.test(compact)) return "2mile";
  if (compact.includes("mile")) return "mile";
  if (/^1500m?$/.test(compact)) return "1500";
  if (/^1600m?$/.test(compact)) return "1600";
  if (/^3000m?$/.test(compact)) return "3000";
  if (/^3200m?$/.test(compact)) return "3200";
  if (/^5000m?$/.test(compact)) return "5000";
  if (compact.includes("8k")) return "8k-xc";
  if (compact === "6k") return "6k-xc";
  if (compact === "5k") return "5k-xc";
  if (compact === "4k") return "4k-xc";
  if (compact.includes("3.1m") || compact.includes("3.11m")) return "5k-xc";
  if (compact.includes("4m")) return "4m-xc";
  if (compact.includes("4.97") || compact.includes("5m")) return "8k-xc";

  return compact || "unknown";
}

const FALLBACK_DISTANCES: Record<string, number> = {
  "800": 800,
  "1000": 1000,
  "1500": 1500,
  "1600": 1600,
  "mile": 1609.34,
  "3000": 3000,
  "3200": 3200,
  "5000": 5000,
  "10000": 10000,
  "4k-xc": 4000,
  "5k-xc": 5000,
  "6k-xc": 6000,
  "8k-xc": 8000,
  "10k-xc": 10000,
};

const CONVERTIBLE_EVENTS = new Set(
  Object.keys(CONVERSIONS).map((conversion) => conversion.split("->")[0]),
);

export function isSupportedScoringEvent(
  event: string,
  meetType?: "xc" | "tf",
): boolean {
  const key = normalizeEvent(event, meetType);
  const hasFormula = (["male", "female"] as const).some(
    (gender) => FORMULAS[`${key}_${gender}`] !== undefined,
  );

  return hasFormula || key in FALLBACK_DISTANCES || CONVERTIBLE_EVENTS.has(key);
}

// Try to load a JSON table like /wa-tables/Male/1500.json with structure:
// { "unit": "s", "points": [[timeSeconds, points], ...sorted asc by time] }
async function lookupTablePoints(
  eventKey: EventKey,
  gender: Gender
): Promise<Array<[number, number]> | null> {
  try {
    const base =
      typeof window === "undefined"
        ? process.env.NEXT_PUBLIC_TABLE_BASE || "http://localhost:3000"
        : "";
    const res = await fetch(`${base}/wa-tables/${gender}/${eventKey}.json`, { cache: "force-cache" });
    if (!res.ok) return null;
    const data = await res.json();
    return Array.isArray(data.points) ? data.points as Array<[number, number]> : null;
  } catch {
    return null;
  }
}

function lerp(x0: number, y0: number, x1: number, y1: number, x: number) {
  if (x1 === x0) return y0;
  const t = (x - x0) / (x1 - x0);
  return y0 + t * (y1 - y0);
}

function interpolate(points: Array<[number, number]>, seconds: number): number {
  // assumes points sorted by time ascending
  if (points.length === 0) return 0;
  if (seconds <= points[0][0]) return points[0][1];
  if (seconds >= points[points.length - 1][0]) return points[points.length - 1][1];

  // binary search
  let lo = 0, hi = points.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (points[mid][0] === seconds) return points[mid][1];
    if (points[mid][0] < seconds) lo = mid + 1;
    else hi = mid - 1;
  }
  const i1 = lo;
  const i0 = lo - 1;
  const [x0, y0] = points[i0];
  const [x1, y1] = points[i1];
  return lerp(x0, y0, x1, y1, seconds);
}

// Temporary fallback (NOT official WA):
// Use average speed scaled and exponentiated to look vaguely “points-like”.
// Tuned so elite times land ~1000–1300, hobby times ~100–500 (hand-wavy).
function fallbackPoints(eventKey: EventKey, seconds: number): number {
  const d = FALLBACK_DISTANCES[eventKey] ?? 1000;
  const v = d / seconds; // m/s
  // crude curve
  return Math.round(100 * Math.pow(v, 3.2));
}

// Main API
export async function scorePerformance({
  event,
  gender,
  markSeconds,
  meetType,
}: {
  event: string;
  gender: Gender;
  markSeconds: number;
  meetType?: "xc" | "tf";
}): Promise<{ points: number; mode: ScoringMode }> {
  let key = normalizeEvent(event, meetType);
  const g = gender.toLowerCase() as Gender;

  // --- handle conversions ---
  for (const [fromTo, factor] of Object.entries(CONVERSIONS)) {
    const [from, to] = fromTo.split("->");
    if (key === from) {
      key = to.replace("m", "");
      markSeconds *= factor;
      break;
    }
  }

  // --- try quadratic formula ---
  const spec = FORMULAS[`${key}_${g}`];
  if (spec) {
    const { a, b, c } = spec;
    const points = Math.round(a + b * markSeconds + c * markSeconds ** 2);
    return { points, mode: "formula" };
  }

  // --- fallbacks (table or proxy) ---
  const table = await lookupTablePoints(key, gender);
  if (table) {
    return { points: Math.round(interpolate(table, markSeconds)), mode: "table" };
  }

  return { points: fallbackPoints(key, markSeconds), mode: "fallback" };
}

