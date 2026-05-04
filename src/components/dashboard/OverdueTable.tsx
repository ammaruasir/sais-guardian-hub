import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { projects, companies, reviewers, stageLabel } from "@/data";
import { ArrowLeft } from "lucide-react";

export function OverdueTable() {
  const rows = projects.filter((p) => p.overdue);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">مراجعات متأخرة</CardTitle>
        <p className="text-xs text-muted-foreground">Overdue Reviews</p>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">المشروع</TableHead>
              <TableHead className="text-right">المنشأة</TableHead>
              <TableHead className="text-right">المرحلة</TableHead>
              <TableHead className="text-right">أيام التأخير</TableHead>
              <TableHead className="text-right">المراجع</TableHead>
              <TableHead className="text-right">الإجراء</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((p) => {
              const c = companies.find((x) => x.id === p.companyId);
              const r = reviewers.find((x) => x.id === p.reviewerId);
              return (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.nameAr}</TableCell>
                  <TableCell className="text-muted-foreground">{c?.nameAr}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{stageLabel[p.stage].ar}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/15">
                      <span className="num">{p.daysOverdue}</span> يوم
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">{r?.initials}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{r?.nameAr}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="ghost" className="gap-1">
                      فتح <ArrowLeft className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
