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

const initialFormData = {
  id: undefined,
  nome: "",
  descricao: "",
  category: {
    value: undefined,
    label: "",
  },
  categoriaId: undefined,
  status: {
    value: undefined,
    label: "",
  },
  condicaoId: undefined,
  location: {
    value: undefined,
    label: "",
  },
  salaId: undefined,
  quantity: undefined,
  serialNumber: "",
};

export function EditItemDialog({
  open,
  onOpenChange,
  categorias,
  status,
  localizacoes,
  item,
}) {
  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  // const [canSubmit, setCanSubmit] = useState(false)

  useEffect(() => {
    const f = () => {
      if (open && item) {
        setFormData({
          ...item,
          categoriaId: item.category.value,
          condicaoId: item.status.value,
          salaId: item.location.value,
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
      `/item/update/${item.id}`,
      "PUT",
      {
        data: {
          id: item.id,
          nome: formData.nome,
          descricao: formData.descricao,
          serialNumber: formData.serialNumber,
          quantidade: formData.quantidade,
          categoriaId: formData.categoriaId,
          condicaoId: formData.condicaoId,
          salaId: formData.salaId,
        },
      },
      (res) => {
        console.log(res);
        if (!res || res.error) {
          console.log("Failed to update item:", res.error);
          setIsLoading(false);
          toast.warning(res.message ?? "Falha ao atualizar o item!", {
            id: "fetch-toast",
            position: "bottom-right",
          });
          return;
        }
        toast.success(res.message ?? "Item atualizado com sucesso!", {
          id: "fetch-toast",
          position: "bottom-right",
        });
        resetForm();
        setIsLoading(false);
      },
      (err) => {
        console.error("Error updating item:", err?.message ?? err);
        toast.error(err?.message ?? "Falha ao atualizar o item!", {
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

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125 max-h-7/9 overflow-y-auto no-scrollbar">
        <DialogHeader className="">
          <DialogTitle>Editar Item</DialogTitle>
          <DialogDescription>Edite as informações do item</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome do Item</Label>
              <Input
                id="name"
                placeholder="Ex: Notebook Dell XPS 15"
                value={formData.nome}
                onChange={(v) =>
                  handleInputChange("nome", v.currentTarget.value)
                }
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                placeholder="Descrição detalhada do item..."
                rows={3}
                value={formData.descricao}
                onChange={(v) =>
                  handleInputChange("descricao", v.currentTarget.value)
                }
                className="h-13 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Categoria</Label>
                <Select
                  value={String(formData.categoriaId ?? "")}
                  required
                  onValueChange={(value) =>
                    handleInputChange("categoriaId", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecionar" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.length ? (
                      categorias.map((c, i) => (
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

              <div className="grid gap-2">
                <Label htmlFor="location">Status</Label>
                <Select
                  value={String(formData.condicaoId ?? "")}
                  onValueChange={(value) =>
                    handleInputChange("condicaoId", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecionar" />
                  </SelectTrigger>
                  <SelectContent>
                    {status.length ? (
                      status.map((c, i) => (
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

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="serial">Número de Série</Label>
                <Input
                  id="serial"
                  placeholder="Ex: XPS-2024-001"
                  value={formData.serialNumber}
                  onChange={(v) =>
                    handleInputChange(
                      "serialNumber",
                      v.currentTarget.value.trim(),
                    )
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="quantity">Quantidade</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  placeholder="0"
                  value={formData.quantity ?? ""}
                  onChange={(v) =>
                    handleInputChange("quantidade", v.currentTarget.value)
                  }
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Localização</Label>
              <Select
                value={String(formData.salaId ?? "")}
                onValueChange={(value) => handleInputChange("salaId", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecionar" />
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

          <DialogFooter>
            <Button type="reset" variant="outline" onClick={resetForm}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} className="">
              Atualizar Item
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
