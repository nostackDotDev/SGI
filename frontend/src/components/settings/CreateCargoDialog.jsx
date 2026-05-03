import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { request } from "@/lib/request";
import { Loader2 } from "lucide-react";
import { PERMISSION_LABELS } from "@/core/constants/permissions";

const FEATURE_LABELS = {
  ITEM: "Itens",
  USER: "Utilizadores",
  CARGO: "Cargos",
  CATEGORIA: "Categorias",
  SALA: "Salas",
  DEPARTAMENTO: "Departamentos",
  INSTITUICAO: "Instituição",
  CONDICAO: "Condição",
  REGISTO: "Registos",
};

const permissionGroups = Object.entries(PERMISSION_LABELS).reduce(
  (groups, [permissoes, label]) => {
    const [feature] = permissoes.split("_");

    if (!groups[feature]) {
      groups[feature] = {
        feature,
        title: FEATURE_LABELS[feature] ?? feature,
        permissoes: [],
      };
    }

    groups[feature].permissoes.push({ key: permissoes, label });
    return groups;
  },
  {},
);

const sortedPermissionGroups = Object.values(permissionGroups).sort((a, b) =>
  a.title.localeCompare(b.title),
);

const initialFormData = {
  nome: "",
  descricao: "",
  permissoes: [],
};

export function CreateCargoDialog({ open, onOpenChange }) {
  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePermissionToggle = (permissoes, checked) => {
    setFormData((prev) => {
      const nextPermissions = checked
        ? Array.from(new Set([...prev.permissoes, permissoes]))
        : prev.permissoes.filter((item) => item !== permissoes);

      return { ...prev, permissoes: nextPermissions };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    request(
      "/cargo/create",
      "POST",
      {
        data: formData,
        refreshKey: "cargos",
      },
      (res) => {
        if (!res || res.error) {
          console.log("Failed to create new cargo:", res?.error);
          setIsLoading(false);
          return;
        }
        resetForm();
        setIsLoading(false);
      },
      (err) => {
        console.error("Error creating new cargo:", err?.message ?? err);
        setIsLoading(false);
      },
    );
  };

  const resetForm = () => {
    setFormData(initialFormData);
    onOpenChange(false);
  };

  const isGroupChecked = (group) =>
    group.permissoes.every((p) => formData.permissoes.includes(p.key));

  const isGroupIndeterminate = (group) => {
    const selected = group.permissoes.filter((p) =>
      formData.permissoes.includes(p.key),
    ).length;

    return selected > 0 && selected < group.permissoes.length;
  };

  const handleGroupToggle = (group, checked) => {
    setFormData((prev) => {
      const groupKeys = group.permissoes.map((p) => p.key);

      let nextPermissions;

      if (checked) {
        nextPermissions = Array.from(
          new Set([...prev.permissoes, ...groupKeys]),
        );
      } else {
        nextPermissions = prev.permissoes.filter((p) => !groupKeys.includes(p));
      }

      return { ...prev, permissoes: nextPermissions };
    });
  };

  const allPermissions = sortedPermissionGroups.flatMap((g) =>
    g.permissoes.map((p) => p.key),
  );

  const isAllChecked = allPermissions.every((p) =>
    formData.permissoes.includes(p),
  );

  const isAllIndeterminate = formData.permissoes.length > 0 && !isAllChecked;

  const handleAllToggle = (checked) => {
    setFormData((prev) => ({
      ...prev,
      permissoes: checked ? allPermissions : [],
    }));
  };

  return (
    <Dialog
      key={open ? "cargo-open" : "cargo-closed"}
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-125 h-180 max-h-[86vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>Novo Cargo</DialogTitle>
          <DialogDescription>
            Defina o nome, descrição e permissões do cargo.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex flex-col gap-4 py-4 flex-1 min-h-0">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                placeholder="Ex: Administrador"
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
                placeholder="Informações adicionais sobre o cargo"
                rows={3}
                value={formData.descricao}
                onChange={(v) =>
                  handleInputChange("descricao", v.currentTarget.value)
                }
                className="h-13 resize-none"
              />
            </div>

            <div className="flex flex-col gap-3 flex-1 min-h-0">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={isAllChecked}
                    ref={(el) => {
                      if (el) el.indeterminate = isAllIndeterminate;
                    }}
                    onCheckedChange={(checked) =>
                      handleAllToggle(checked === true)
                    }
                  />

                  <div>
                    <p className="text-sm font-medium">Permissões</p>
                    <p className="text-sm text-muted-foreground">
                      Selecione as ações permitidas para este cargo.
                    </p>
                  </div>
                </div>

                <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                  {formData.permissoes.length} selecionada(s)
                </span>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto space-y-2 no-scrollbar">
                {sortedPermissionGroups.map((group) => {
                  const selectedCount = group.permissoes.filter((permissoes) =>
                    formData.permissoes.includes(permissoes.key),
                  ).length;

                  return (
                    <Collapsible
                      key={group.feature}
                      className="rounded-lg border border-border bg-card"
                    >
                      <CollapsibleTrigger className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-sm font-semibold">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={isGroupChecked(group)}
                            ref={(el) => {
                              if (el)
                                el.indeterminate = isGroupIndeterminate(group);
                            }}
                            onCheckedChange={(checked) =>
                              handleGroupToggle(group, checked === true)
                            }
                            onClick={(e) => e.stopPropagation()}
                          />

                          <div>
                            <div>{group.title}</div>
                            <div className="text-xs text-muted-foreground">
                              {selectedCount} de {group.permissoes.length}{" "}
                              selecionadas
                            </div>
                          </div>
                        </div>

                        <span className="text-muted-foreground">Detalhes</span>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="border-t border-border px-4 py-3">
                        <div className="grid gap-2">
                          {group.permissoes.map((permissoes) => (
                            <label
                              key={permissoes.key}
                              className="flex items-center gap-3 rounded-lg border border-border px-3 py-2"
                            >
                              <Checkbox
                                checked={formData.permissoes.includes(
                                  permissoes.key,
                                )}
                                onCheckedChange={(checked) =>
                                  handlePermissionToggle(
                                    permissoes.key,
                                    checked === true,
                                  )
                                }
                              />
                              <span className="text-sm">
                                {permissoes.label}
                              </span>
                            </label>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  );
                })}
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
              Adicionar Cargo
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
