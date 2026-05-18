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
  salaId: undefined,
  quantidade: undefined,
  type: undefined,
  reason: "",
};

export function RegisterStatusChangeDialog({
  open,
  onOpenChange,
  localizacoes,
  item,
  onSuccess,
}) {
  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const f = () => {
      if (open && item) {
        setFormData({
          id: item.id,
          quantidade: undefined,
          salaId: undefined,
          type: undefined,
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
      `/item/status-change/${item.id}`,
      "POST",
      {
        data: {
          quantidade: formData.quantidade
            ? Number(formData.quantidade)
            : undefined,
          salaId: formData.salaId ? Number(formData.salaId) : undefined,
          type: formData.type || undefined,
          reason: formData.reason || undefined,
        },
        refreshKey: "items",
      },
      (res) => {
        console.log(res);
        if (!res || res.error) {
          console.log("Failed to register status change:", res.error);
          setIsLoading(false);
          toast.warning(res.message ?? "Falha ao registar mudança de status!", {
            id: "fetch-toast",
            position: "bottom-right",
          });
          return;
        }
        onSuccess?.();
        toast.success(
          res.message ?? "Mudança de status registada com sucesso!",
          {
            id: "fetch-toast",
            position: "bottom-right",
          },
        );
        resetForm();
        setIsLoading(false);
      },
      (err) => {
        console.error("Error registering status change:", err?.message ?? err);
        toast.error(err?.message ?? "Falha ao registar mudança de status!", {
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
    !formData.salaId ||
    !formData.type ||
    Number(formData.salaId) === item?.location.value ||
    Number(formData.quantidade) > item?.quantity;

  useEffect(() => {
    console.log("Form data changed:", formData);
  }, [formData, item]);

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125 max-h-7/9 overflow-y-auto no-scrollbar">
        <DialogHeader className="">
          <DialogTitle>Registar Devolução</DialogTitle>
          <DialogDescription>Mudar o status de {item.nome}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="quantity">Quantidade a devolver</Label>
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
            <div className="grid xs:grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="location">Status</Label>
                <Select
                  value={String(formData.type ?? "")}
                  onValueChange={(value) => handleInputChange("type", value)}
                >
                  <SelectTrigger className="w-full" required>
                    <SelectValue placeholder="Selecionar status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maintenance">Manutenção</SelectItem>
                    <SelectItem value="borrow">Empréstimo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Transferir para</Label>
                <Select
                  value={String(formData.salaId ?? "")}
                  onValueChange={(value) => handleInputChange("salaId", value)}
                >
                  <SelectTrigger className="w-full" required>
                    <SelectValue placeholder="Selecionar local" />
                  </SelectTrigger>
                  <SelectContent>
                    {localizacoes.length ? (
                      localizacoes.map((c, i) => (
                        <SelectItem key={i} value={String(c.id)}>
                          {c.nome}
                        </SelectItem>
                      ))
                    ) : (
                      <>
                        <SelectItem key={0} value={undefined}>
                          Falha ao carregar
                        </SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reason">Motivo (opcional)</Label>
              <Textarea
                id="reason"
                placeholder="Ex: Em mau estado, danificado"
                value={formData.reason}
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
              Registar Mudança de Status
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
