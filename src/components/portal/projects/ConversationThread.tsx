import { useState } from "react";
import { Paperclip, Send, Shield, Building2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getMessagesByProject, type PortalMessage } from "@/data/portalConversations";
import { cn } from "@/lib/utils";

export function ConversationThread({ projectId }: { projectId: string }) {
  const [messages, setMessages] = useState<PortalMessage[]>(() => getMessagesByProject(projectId));
  const [text, setText] = useState("");

  function send() {
    if (!text.trim()) return;
    setMessages((m) => [
      ...m,
      {
        id: `local-${Date.now()}`,
        projectId,
        sender: "company",
        senderName: "م. أحمد الراشد",
        ts: new Date().toISOString().slice(0, 16).replace("T", " "),
        body: text.trim(),
      },
    ]);
    setText("");
    toast.success("تم إرسال الرسالة");
  }

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="max-h-[480px] space-y-4 overflow-y-auto p-5">
        {messages.map((m) => {
          const isCompany = m.sender === "company";
          return (
            <div key={m.id} className={cn("flex gap-2", isCompany ? "flex-row-reverse" : "")}>
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                  isCompany ? "bg-secondary text-secondary-foreground" : "bg-primary text-primary-foreground",
                )}
              >
                {isCompany ? <Building2 className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
              </div>
              <div className={cn("max-w-[75%]", isCompany ? "text-left" : "text-right")}>
                <div className={cn("flex items-center gap-2 text-[11px] text-muted-foreground", isCompany && "flex-row-reverse")}>
                  <span className="font-semibold">{m.senderName}</span>
                  <span className="num">{m.ts}</span>
                </div>
                <div
                  className={cn(
                    "mt-1 inline-block rounded-2xl px-3 py-2 text-sm leading-relaxed",
                    isCompany ? "bg-secondary/15 text-foreground" : "bg-muted text-foreground",
                  )}
                >
                  {m.body}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex items-end gap-2 border-t border-border p-3">
        <Button variant="ghost" size="icon" onClick={() => toast("اختر ملفاً للإرفاق")}>
          <Paperclip className="h-4 w-4" />
        </Button>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="اكتب رسالتك..."
          rows={2}
          className="flex-1 resize-none"
        />
        <Button onClick={send}>
          <Send className="ms-1 h-4 w-4" /> إرسال رسالة
        </Button>
      </div>
    </div>
  );
}
