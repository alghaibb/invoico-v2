"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface GraphProps {
  data: {
    date: string;
    amount: number;
  }[];
}

export default function Graph({ data }: GraphProps) {
  return (
    <div className="w-full overflow-x-auto">
      <ChartContainer
        config={{
          amount: {
            label: "Amount",
            color: "hsl(var(--primary))",
          },
        }}
        className="min-h-[300px] w-full max-w-full"
      >
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis dataKey="date" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
