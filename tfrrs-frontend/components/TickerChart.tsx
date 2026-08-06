"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from "recharts";

type TickerDatum = {
  date: string;
  rating: number;
  label?: string;
};

interface TickerChartProps {
  data: TickerDatum[];
}

function RatingTooltip({
  active,
  payload,
  label,
}: TooltipContentProps) {
  if (!active || !payload.length) return null;

  const entry = payload[0];
  const datum = entry.payload as TickerDatum | undefined;
  const rawRating = entry.value;
  const rating =
    typeof rawRating === "number"
      ? rawRating
      : typeof rawRating === "string"
        ? Number(rawRating)
        : Number.NaN;

  return (
    <div className="max-w-72 rounded-xl border border-border bg-panel/95 px-3 py-2 shadow-2xl backdrop-blur">
      <div className="flex items-center justify-between gap-4">
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
          {label}
        </span>
        <strong className="font-mono text-sm text-accent">
          {Number.isFinite(rating) ? rating.toFixed(2) : "—"}
        </strong>
      </div>
      {datum?.label && <p className="mt-1 text-xs leading-5 text-foreground">{datum.label}</p>}
    </div>
  );
}

export default function TickerChart({ data }: TickerChartProps) {
  if (!data.length) {
    return (
      <section className="grid min-h-64 place-items-center rounded-2xl border border-border bg-panel px-6 text-center shadow-[0_18px_50px_rgb(0_0_0/0.2)]">
        <div>
          <p className="text-sm font-semibold text-foreground">No rating history yet</p>
          <p className="mt-1 text-xs text-muted">
            A trend will appear after the athlete has a scored performance.
          </p>
        </div>
      </section>
    );
  }

  const firstRating = data[0]?.rating ?? 0;
  const latestRating = data.at(-1)?.rating ?? firstRating;
  const ratingChange = latestRating - firstRating;

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-panel shadow-[0_18px_50px_rgb(0_0_0/0.2)]">
      <header className="flex flex-col gap-3 border-b border-border px-4 py-4 sm:flex-row sm:items-end sm:justify-between sm:px-5">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
            Performance ticker
          </p>
          <h2 className="mt-1 text-lg font-bold text-foreground">Rating momentum</h2>
        </div>
        <div className="flex items-baseline gap-3 sm:text-right">
          <strong className="font-mono text-2xl text-foreground">{latestRating.toFixed(2)}</strong>
          <span
            className={`font-mono text-xs font-bold ${
              ratingChange >= 0 ? "text-positive" : "text-negative"
            }`}
          >
            {ratingChange >= 0 ? "+" : ""}
            {ratingChange.toFixed(2)}
          </span>
        </div>
      </header>

      <div className="h-72 px-1 pb-3 pt-5 sm:px-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 6" vertical={false} />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              minTickGap={28}
              tick={{ fill: "var(--muted)", fontSize: 11 }}
              tickMargin={12}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              width={48}
              domain={["dataMin - 20", "dataMax + 20"]}
              tick={{ fill: "var(--muted)", fontSize: 11 }}
              tickFormatter={(value: number) => Math.round(value).toString()}
            />
            <Tooltip
              content={RatingTooltip}
              cursor={{ stroke: "var(--accent)", strokeDasharray: "4 4", strokeOpacity: 0.45 }}
            />
            <Line
              type="monotone"
              dataKey="rating"
              name="Rating"
              stroke="var(--accent)"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 5, fill: "var(--accent)", stroke: "var(--accent-ink)", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
