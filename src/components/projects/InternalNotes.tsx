import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { ProjectNote } from "@/data/notes";
import { toast } from "sonner";

export function InternalNotes({ initial }: { initial: ProjectNote[] }) {
  const [notes, setNotes] = useState(initial);
  const [text, setText] = useState("");
  function add() {
    if (!text.trim()) return;
    setNotes([
      {
        id: `n-${Date.now()}`,
        projectId: initial[0]?.projectId ?? "",
        author: "أنت",
        ts: "الآن",
        text,
      },
      ...notes,
    ]);
    setText("");
    toast.success("تمت إضافة الملاحظة");
  }
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-3">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="اكتب ملاحظة داخلية لفريق الهيئة فقط..."
          rows={3}
        />
        <div className="mt-2 flex items-center justify-between">
          <p className="text-[11px] text-muted-foreground">
            الملاحظات الداخلية لا تُعرض على المنشأة.
          </p>
          <Button size="sm" onClick={add}>
            إضافة ملاحظة
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        {notes.map((n) => (
          <div key={n.id} className="flex gap-3 rounded-lg border border-border bg-card p-3">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-secondary text-secondary-foreground">
                {n.author[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">{n.author}</span>
                <span className="text-[11px] text-muted-foreground">{n.ts}</span>
              </div>
              <p className="mt-1 text-sm text-foreground/90">{n.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
