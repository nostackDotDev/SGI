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
  numeroSala: "",
  tipoSala: "",
  departamentoId: undefined,
};

export function CreateLocationDialog({ open, onOpenChange, departaments }) {
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
      "/localizacao/create",
      "POST",
      {
        data: formData,
      },
      (res) => {
        console.log(res);
        if (!res || res.error) {
          console.log("Failed to create new location:", res.error);
          setIsLoading(false);
          return;
        }
        resetForm();
        setIsLoading(false);
      },
      (err) => {
        console.error("Error creating new location:", err?.message ?? err);
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
          <DialogTitle>Nova Localização</DialogTitle>
          <DialogDescription>
            Preencha as informações da nova localização
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome da Localização</Label>
              <Input
                id="name"
                placeholder="Ex: Sala 101"
                value={formData.numeroSala}
                onChange={(v) =>
                  handleInputChange("numeroSala", v.currentTarget.value)
                }
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="locatioonType">Tipo</Label>
                <Input
                  id="locationType"
                  type="text"
                  placeholder="Laboratório"
                  defaultValue={formData.tipoSala ?? ""}
                  onChange={(v) =>
                    handleInputChange("tipoSala", v.currentTarget.value)
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Departamento</Label>
                <Select
                  value={formData.departamentoId ?? ""}
                  required
                  onValueChange={(value) =>
                    handleInputChange("departamentoId", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecionar" />
                  </SelectTrigger>
                  <SelectContent>
                    {departaments.length ? (
                      departaments.map((d, i) => (
                        <SelectItem key={i} value={d.id}>
                          {d.nome}
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
              Adicionar Localização{" "}
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
