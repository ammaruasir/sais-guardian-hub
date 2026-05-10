import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { ReactNode } from "react";
import { useT } from "@/hooks/useT";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title?: string;
  description?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
  onConfirm: () => void;
};

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText,
  cancelText,
  destructive = true,
  onConfirm,
}: Props) {
  const { t, isAr } = useT();
  const resolvedTitle = title ?? t("confirm_delete_title");
  const resolvedDescription =
    description ?? (isAr ? "هل أنت متأكد؟ لا يمكن التراجع عن هذا الإجراء." : "Are you sure? This action cannot be undone.");
  const resolvedConfirm = confirmText ?? t("confirm");
  const resolvedCancel = cancelText ?? t("cancel");
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{resolvedTitle}</DialogTitle>
          <DialogDescription>{resolvedDescription}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-row justify-start gap-2 sm:justify-start">
          <Button
            variant={destructive ? "destructive" : "default"}
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            {resolvedConfirm}
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {resolvedCancel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
