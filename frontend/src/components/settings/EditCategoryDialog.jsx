import { useEffect, useState } from "react";
import { request, refreshManager } from "@/lib/request";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export function EditCategoryDialog({ open, onOpenChange, category }) {
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const f = () => {
      if (open && category) {
        setFormData({
          nome: category.nome || "",
          descricao: category.descricao || "",
        });
      }
    };
    f();
  }, [open, category]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    request(
      `/categoria/update/${category.id}`,
      "PUT",
      {
        data: formData,
      },
      () => {
        refreshManager.refresh("categorias");
        setIsLoading(false);
        onOpenChange(false);
      },
      () => setIsLoading(false),
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Categoria</DialogTitle>
          <DialogDescription>
            Edite as informações da categoria
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div>
              <Label>Nome</Label>
              <Input
                value={formData.nome}
                onChange={(e) =>
                  setFormData({ ...formData, nome: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label>Descrição</Label>
              <Input
                value={formData.descricao}
                onChange={(e) =>
                  setFormData({ ...formData, descricao: e.target.value })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
