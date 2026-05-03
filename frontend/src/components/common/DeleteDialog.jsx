import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Trash2Icon } from "lucide-react";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

export default function DeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  withReason = false,
  reason,
  setReason,
}) {
  const handleDelete = () => {
    if (withReason && !reason.trim()) {
      return;
    }
    onConfirm();
  };

  if (!open) return;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">{title}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        {withReason && (
          <div className="grid gap-2">
            <Label htmlFor="reason">Motivo</Label>
            <Textarea
              id="reason"
              placeholder="Motivo para a eliminação do item..."
              rows={3}
              value={reason}
              onChange={(v) => setReason(v.currentTarget.value)}
              className="h-13 resize-none"
            />
          </div>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Cancelar</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleDelete}
            disabled={withReason && !reason.trim()}
          >
            Continuar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
