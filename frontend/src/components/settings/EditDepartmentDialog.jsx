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
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { request } from "@/lib/request";
import { toast } from "sonner";
import { getFormState } from "@/lib/utils";

const initialFormData = {
  id: undefined,
  nome: "",
  descricao: "",
};

export function EditDepartmentDialog({ open, onOpenChange, department }) {
  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const f = () => {
      if (open && department) {
        setFormData({
          id: department.id,
          nome: department.nome ?? "",
          descricao: department.descricao ?? "",
        });
      }
    };
    f();

    return () => setFormData(initialFormData);
  }, [open, department]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    request(
      `/departamento/update/${department.id}`,
      "PUT",
      {
        data: {
          id: department.id,
          nome: formData.nome,
          descricao: formData.descricao,
        },
        refreshKey: "departamentos",
      },
      (res) => {
        if (!res || res.error) {
          toast.error(res?.message ?? "Erro ao atualizar departamento!", {
            id: "fetch-toast",
            position: "bottom-right",
          });
          setIsLoading(false);
          return;
        }

        toast.success(res?.message ?? "Departamento atualizado com sucesso!", {
          id: "fetch-toast",
          position: "bottom-right",
        });

        resetForm();
        setIsLoading(false);
      },
      (err) => {
        toast.error(err?.message ?? "Erro ao atualizar departamento!", {
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

  const { canSubmit } = getFormState(formData, initialFormData, ["nome"]);

  if (!department) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125 max-h-7/9 overflow-y-auto no-scrollbar">
        <DialogHeader>
          <DialogTitle>Editar Departamento</DialogTitle>
          <DialogDescription>
            Atualize as informações do departamento
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                placeholder="Ex: TI"
                value={formData.nome}
                onChange={(e) =>
                  handleInputChange("nome", e.currentTarget.value)
                }
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                placeholder="Descrição do departamento"
                rows={3}
                value={formData.descricao}
                onChange={(e) =>
                  handleInputChange("descricao", e.currentTarget.value)
                }
                className="h-13 resize-none"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="reset" variant="outline" onClick={resetForm}>
              Cancelar
            </Button>

            <Button type="submit" disabled={isLoading || !canSubmit}>
              Atualizar Departamento
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
