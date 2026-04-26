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

const initialFormData = {
  nome: "",
  descricao: "",
  quantidade: undefined,
  categoriaId: undefined,
  condicaoId: undefined,
  salaId: undefined,
};

export function CreateItemDialog({ open, onOpenChange, condicoes }) {
  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  // const [canSubmit, setCanSubmit] = useState(false)

  useEffect(() => {
    const f = () => {
      if (open) {
        setFormData(initialFormData);
      }
    };
    f();
  }, [open]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    request(
      "/item/create",
      "POST",
      {
        data: formData,
      },
      (res) => {
        console.log(res);
        if (!res || res.error) {
          console.log("Failed to create new item:", res.error);
          setIsLoading(false);
          return;
        }
        resetForm();
        setIsLoading(false);
      },
      (err) => {
        console.error("Error creating new item:", err?.message ?? err);
        setIsLoading(false);
      },
    );
  };

  const resetForm = () => {
    setFormData(initialFormData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125 max-h-7/9 overflow-y-auto no-scrollbar">
        <DialogHeader className="">
          <DialogTitle>Novo Item</DialogTitle>
          <DialogDescription>
            Preencha as informações do novo item
          </DialogDescription>
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
                  value={formData.categoriaId ?? ""}
                  required
                  onValueChange={(value) =>
                    handleInputChange("categoriaId", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Eletrônicos</SelectItem>
                    <SelectItem value="2">Periféricos</SelectItem>
                    <SelectItem value="3">Áudio</SelectItem>
                    <SelectItem value="4">Cabos</SelectItem>
                    <SelectItem value="5">Adaptadores</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="location">Status</Label>
                <Select
                  value={formData.salaId ?? ""}
                  onValueChange={(value) => handleInputChange("salaId", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecionar" />
                  </SelectTrigger>
                  <SelectContent>
                    {condicoes.length ? (
                      condicoes.map((c, i) => (
                        <SelectItem key={i} value={c.id}>
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
                  //   value={formData.descricao}
                  // onChange={(v)=> handleInputChange("descricao", v.currentTarget.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="quantity">Quantidade</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  placeholder="0"
                  defaultValue={formData.quantidade ?? ""}
                  onChange={(v) =>
                    handleInputChange("quantidade", v.currentTarget.value)
                  }
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Localização</Label>
              <Select
                value={formData.condicaoId ?? ""}
                onValueChange={(value) =>
                  handleInputChange("condicaoId", value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecionar" />
                </SelectTrigger>
                <SelectContent>
                  {condicoes.length ? (
                    condicoes.map((c, i) => (
                      <SelectItem key={i} value={c.id}>
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
              Adicionar Item
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
