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

import { useEffect, useState } from "react";
import { request } from "@/lib/request";
import { Loader2 } from "lucide-react";

const initialFormData = {
  id: undefined,
  numeroSala: "",
  tipoSala: "",
  departamentoId: "",
};

export function EditLocationDialog({
  open,
  onOpenChange,
  location,
  departaments = [],
}) {
  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const f = () => {
      if (open && location) {
        setFormData({
          id: location.id ?? undefined,

          numeroSala: location.numeroSala ?? location.nome ?? "",
          tipoSala: location.tipoSala ?? location.tipo ?? "",

          departamentoId:
            departaments.find((d) => d.nome === location.departamento)?.id ??
            "",
        });
      } else {
        setFormData(initialFormData);
      }
    };
    f();

    console.log("location", location);
  }, [open, location]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
    onOpenChange(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    request(
      `/localizacao/update/${formData.id}`,
      "PUT",
      {
        data: formData,
        refreshKey: "localizacoes",
      },
      (res) => {
        if (!res || res.error) {
          setIsLoading(false);
          return;
        }

        setIsLoading(false);
        resetForm();
      },
      (err) => {
        console.error("Error updating location:", err?.message ?? err);
        setIsLoading(false);
      },
    );
  };

  if (!location) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Editar Localização</DialogTitle>
          <DialogDescription>
            Atualize os dados da localização
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Nome */}
            <div className="grid gap-2">
              <Label htmlFor="name">Nome da Localização</Label>
              <Input
                id="name"
                placeholder="Ex: Sala 101"
                value={formData.numeroSala}
                onChange={(e) =>
                  handleInputChange("numeroSala", e.currentTarget.value)
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {/* Tipo */}
              <div className="grid gap-2">
                <Label htmlFor="locationType">Tipo</Label>
                <Input
                  id="locationType"
                  type="text"
                  value={formData.tipoSala}
                  placeholder="Sala de aula, laboratório"
                  onChange={(e) =>
                    handleInputChange("tipoSala", e.currentTarget.value)
                  }
                />
              </div>

              {/* Departamento */}
              <div className="grid gap-2">
                <Label htmlFor="categorySelect">Departamento</Label>

                <Select
                  value={String(formData.departamentoId || "")}
                  onValueChange={(value) =>
                    handleInputChange("departamentoId", value)
                  }
                >
                  <SelectTrigger id="categorySelect" className="w-full">
                    <SelectValue placeholder="Selecionar departamento" />
                  </SelectTrigger>

                  <SelectContent>
                    {departaments.length ? (
                      departaments.map((d) => (
                        <SelectItem key={d.id} value={String(d.id)}>
                          {d.nome}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none">Nenhum departamento</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="reset" variant="outline" onClick={resetForm}>
              Cancelar
            </Button>

            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Atualizar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
