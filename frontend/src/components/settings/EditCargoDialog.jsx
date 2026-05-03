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
import { useEffect, useState } from "react";
import { request, refreshManager } from "@/lib/request";
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

export function EditCargoDialog({ open, onOpenChange, cargo }) {
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    permissoes: [],
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const f = () => {
      if (open && cargo) {
        setFormData({
          nome: cargo.nome || "",
          descricao: cargo.descricao || "",
          permissoes: cargo.permissoes || [],
        });
      }

      if (!open) {
        setFormData({
          nome: "",
          descricao: "",
          permissoes: [],
        });
      }
    };
    f();
  }, [open, cargo?.id]);

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

    if (!cargo) return;

    setIsLoading(true);

    request(
      `/cargo/update/${cargo.id}`,
      "PUT",
      {
        data: formData,
      },
      () => {
        refreshManager.refresh("cargos");
        setIsLoading(false);
        onOpenChange(false);
      },
      () => setIsLoading(false),
    );
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125 h-180 max-h-[86vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>Editar Cargo</DialogTitle>
          <DialogDescription>
            Atualize as informações e permissões do cargo
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex flex-col gap-4 py-4 flex-1 min-h-0">
            {/* NOME */}
            <div className="grid gap-2">
              <Label>Nome</Label>
              <Input
                value={formData.nome}
                onChange={(e) => handleInputChange("nome", e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label>Descrição</Label>
              <Textarea
                value={formData.descricao}
                onChange={(e) => handleInputChange("descricao", e.target.value)}
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
                      Selecione as ações permitidas
                    </p>
                  </div>
                </div>

                <span className="text-xs text-muted-foreground">
                  {formData.permissoes.length} selecionada(s)
                </span>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto space-y-2 no-scrollbar">
                {sortedPermissionGroups.map((group) => {
                  const selectedCount = group.permissoes.filter((p) =>
                    formData.permissoes.includes(p.key),
                  ).length;

                  return (
                    <Collapsible
                      key={group.feature}
                      className="rounded-lg border border-border"
                    >
                      <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-3">
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
                              {selectedCount} de {group.permissoes.length}
                            </div>
                          </div>
                        </div>
                      </CollapsibleTrigger>

                      <CollapsibleContent className="px-4 py-3 border-t">
                        {group.permissoes.map((p) => (
                          <label
                            key={p.key}
                            className="flex items-center gap-3 py-1"
                          >
                            <Checkbox
                              checked={formData.permissoes.includes(p.key)}
                              onCheckedChange={(checked) =>
                                handlePermissionToggle(p.key, checked === true)
                              }
                            />
                            {p.label}
                          </label>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  );
                })}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              Salvar
              {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
