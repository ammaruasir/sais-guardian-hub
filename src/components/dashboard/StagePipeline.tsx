import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";
import { stageLabel } from "@/data";

const data = [
  { stage: stageLabel[1].ar, count: 3 },
  { stage: stageLabel[2].ar, count: 2 },
  { stage: stageLabel[3].ar, count: 4 },
  { stage: stageLabel[4].ar, count: 3 },
];

const colors = ["var(--chart-2)", "var(--chart-1)", "var(--chart-3)", "var(--chart-4)"];

export function StagePipeline() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">المشاريع حسب المرحلة</CardTitle>
        <p className="text-xs text-muted-foreground">Projects by Stage</p>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="stage"
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                reversed
              />
              <YAxis
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                orientation="right"
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  fontSize: 12,
                  color: "var(--popover-foreground)",
                }}
                itemStyle={{ color: "var(--popover-foreground)" }}
                labelStyle={{ color: "var(--popover-foreground)" }}
                cursor={{ fill: "var(--muted)", opacity: 0.4 }}
              />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {data.map((_, i) => (
                  <Cell key={i} fill={colors[i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
