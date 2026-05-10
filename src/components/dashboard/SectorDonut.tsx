import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const data = [
  { name: "بترول", value: 4, color: "var(--chart-1)" },
  { name: "بتروكيماويات", value: 3, color: "var(--chart-2)" },
  { name: "تعدين", value: 2, color: "var(--chart-3)" },
  { name: "كهرباء", value: 2, color: "var(--chart-4)" },
  { name: "أخرى", value: 1, color: "var(--chart-5)" },
];

export function SectorDonut() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">المشاريع حسب القطاع</CardTitle>
        <p className="text-xs text-muted-foreground">Projects by Sector</p>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={50}
                outerRadius={85}
                paddingAngle={2}
              >
                {data.map((d, i) => (
                  <Cell key={i} fill={d.color} stroke="var(--card)" strokeWidth={2} />
                ))}
              </Pie>
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
              />
              <Legend wrapperStyle={{ fontSize: 12, color: "var(--foreground)" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
