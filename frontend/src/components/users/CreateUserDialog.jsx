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
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

const initialFormData = {
  nome: "",
  email: "",
  password: "",
  descricao: "",
  cargoId: undefined,
};

export function CreateUserDialog({ open, onOpenChange, cargos }) {
  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

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
      "/utilizador/create",
      "POST",
      {
        data: formData,
      },
      (res) => {
        console.log(res);
        if (!res || res.error) {
          console.log("Failed to create new user:", res.error);
          toast.warning(
            res.message || "Ocorreu um erro ao criar o utilizador",
            {
              id: "fetch-toast",
              position: "bottom-right",
            },
          );
          setIsLoading(false);
          return;
        }
        toast.success(res.message || "Utilizador criado com sucesso", {
          id: "fetch-toast",
          position: "bottom-right",
        });
        resetForm();
        setIsLoading(false);
      },
      (err) => {
        console.error("Error creating new user:", err?.message ?? err);
        toast.error(err?.message || "Ocorreu um erro ao criar o utilizador", {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[86dvw] max-h-7/9 overflow-y-auto no-scrollbar">
        <DialogHeader className="">
          <DialogTitle>Novo Utilizador</DialogTitle>
          <DialogDescription>
            Criar um novo utilizador para acessar o sistema
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4 mb-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                placeholder="Ex: John Doe"
                value={formData.nome}
                onChange={(v) =>
                  handleInputChange("nome", v.currentTarget.value)
                }
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="locatioonType">Descrição</Label>
                <Input
                  id="locationType"
                  type="text"
                  placeholder="Descrição"
                  defaultValue={formData.descricao ?? ""}
                  onChange={(v) =>
                    handleInputChange("descricao", v.currentTarget.value)
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Cargo</Label>
                <Select
                  value={String(formData.cargoId ?? "")}
                  required
                  onValueChange={(value) => handleInputChange("cargoId", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecionar" />
                  </SelectTrigger>
                  <SelectContent>
                    {cargos.length ? (
                      cargos.map((d, i) => (
                        <SelectItem key={i} value={String(d.id)}>
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

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="userEmail">Email</Label>
                <Input
                  id="userEmail"
                  type="email"
                  placeholder="Email"
                  defaultValue={formData.email ?? ""}
                  onChange={(v) =>
                    handleInputChange("email", v.currentTarget.value)
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Palavra-passe</Label>
                <div className="relative">
                  <Input
                    id="userPassword"
                    type={isPasswordVisible ? "text" : "password"}
                    placeholder="Palavra-passe"
                    defaultValue={formData.password ?? ""}
                    onChange={(v) =>
                      handleInputChange("password", v.currentTarget.value)
                    }
                  />
                  <i
                    onClick={() => setIsPasswordVisible((e) => !e)}
                    className="absolute top-1/2 right-2 w-fit bg-transparent pr-2 flex items-center justify-center cursor-pointer -translate-y-1/2"
                  >
                    {isPasswordVisible ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </i>
                </div>
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
              Adicionar Utilizador{" "}
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
