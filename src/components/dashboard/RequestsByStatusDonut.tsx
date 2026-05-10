import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { useAppStore } from "@/store/appStore";
import { requestStatusLabel, type RequestStatus } from "@/data/requests";

const colors: Record<RequestStatus, string> = {
  submitted: "var(--chart-2)",
  in_review: "var(--chart-1)",
  additional_docs: "var(--warning)",
  escalated: "var(--chart-4)",
  approved: "var(--success)",
  rejected: "var(--destructive)",
  returned: "var(--muted-foreground)",
};

export function RequestsByStatusDonut() {
  const requests = useAppStore((s) => s.requests);
  const counts: Record<string, number> = {};
  for (const r of requests) counts[r.status] = (counts[r.status] ?? 0) + 1;
  const data = (Object.keys(counts) as RequestStatus[]).map((k) => ({
    name: requestStatusLabel[k].ar,
    value: counts[k],
    color: colors[k],
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">الطلبات حسب الحالة</CardTitle>
        <p className="text-xs text-muted-foreground">Requests by Status</p>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85} paddingAngle={2}>
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
