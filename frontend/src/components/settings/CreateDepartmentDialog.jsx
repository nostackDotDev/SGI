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
import { Loader2 } from "lucide-react";

const initialFormData = {
  nome: "",
  descricao: "",
};

export function CreateDepartmentDialog({ open, onOpenChange }) {
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
      "/departamento/create",
      "POST",
      {
        data: formData,
        refreshKey: "departamentos",
      },
      (res) => {
        console.log(res);
        if (!res || res.error) {
          console.log("Failed to create new department:", res.error);
          setIsLoading(false);
          return;
        }
        resetForm();
        setIsLoading(false);
      },
      (err) => {
        console.error("Error creating new department:", err?.message ?? err);
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
          <DialogTitle>Novo Departamento</DialogTitle>
          <DialogDescription>
            Preencha as informações do novo departamento
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                placeholder="Ex: TI"
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
                placeholder="Informações adicionais sobre o departamento"
                rows={3}
                value={formData.descricao}
                onChange={(v) =>
                  handleInputChange("descricao", v.currentTarget.value)
                }
                className="h-13 resize-none"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="reset" variant="outline" onClick={resetForm}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center gap-2"
            >
              Adicionar Departamento{" "}
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
