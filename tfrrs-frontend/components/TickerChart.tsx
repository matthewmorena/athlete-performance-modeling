"use client";

import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface TickerChartProps {
  data: { date: string; rating: number }[];
}

export default function TickerChart({ data }: TickerChartProps) {
  return (
    <div className="h-64 bg-white rounded-xl border p-4 shadow-sm text-gray-500">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="rating"
            stroke="#008235"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
