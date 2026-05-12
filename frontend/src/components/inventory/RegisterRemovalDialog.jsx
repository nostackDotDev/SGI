import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { request } from "@/lib/request";
import { toast } from "sonner";
import { Badge } from "../ui/badge";

const initialFormData = {
  id: undefined,
  quantidade: undefined,
  reason: "",
};

export function RegisterRemovalDialog({ open, onOpenChange, item, onSuccess }) {
  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const f = () => {
      if (open && item) {
        setFormData({
          id: item.id,
          quantidade: undefined,
          reason: "",
        });
      } else {
        setFormData(initialFormData);
      }
    };
    f();
  }, [open, item]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    request(
      `/item/exit/${item.id}`,
      "POST",
      {
        data: {
          quantidade: formData.quantidade
            ? Number(formData.quantidade)
            : undefined,
          reason: formData.reason || undefined,
          transferType: "exit",
        },
        refreshKey: "items",
      },
      (res) => {
        console.log(res);
        if (!res || res.error) {
          console.log("Failed to register exit:", res.error);
          setIsLoading(false);
          toast.warning(res.message ?? "Falha ao registar remoção!", {
            id: "fetch-toast",
            position: "bottom-right",
          });
          return;
        }
        onSuccess?.();
        toast.success(res.message ?? "Remoção registada com sucesso!", {
          id: "fetch-toast",
          position: "bottom-right",
        });
        resetForm();
        setIsLoading(false);
      },
      (err) => {
        console.error("Error registering exit:", err?.message ?? err);
        toast.error(err?.message ?? "Falha ao registar remoção!", {
          id: "fetch-toast",
          position: "bottom-right",
        });
        setIsLoading(false);
      },
    );
  };

  const resetForm = () => {
    setFormData(initialFormData);
    onOpenChange(false);
  };
  const isDisabled =
    !formData.quantidade ||
    Number(formData.quantidade) > item?.quantity ||
    formData.reason?.trim()?.length < 3;

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125 max-h-7/9 overflow-y-auto no-scrollbar">
        <DialogHeader className="">
          <DialogTitle>Registar Remoção</DialogTitle>
          <DialogDescription>
            Registar a remoção de {item.nome} do inventário
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="quantity">Quantidade a remover</Label>
                <Badge variant="secondary" className="px-2 py-3">
                  Disponível: {item.quantity}
                </Badge>
              </div>
              <Input
                id="quantity"
                type="number"
                min="1"
                max={item.quantity}
                placeholder="0"
                value={formData.quantidade ?? ""}
                onChange={(v) =>
                  handleInputChange("quantidade", v.currentTarget.value)
                }
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="reason">Motivo</Label>
              <Textarea
                id="reason"
                placeholder="Ex: Devolvido em bom estado, sem danos"
                value={formData.reason}
                required
                minLength={3}
                onChange={(e) =>
                  handleInputChange("reason", e.currentTarget.value)
                }
                className="resize-none"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="reset" variant="outline" onClick={resetForm}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading || isDisabled}
              className=""
            >
              Registar remoção
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
