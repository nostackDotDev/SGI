import PageContainer from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { request, refreshManager } from "@/lib/request";
import { cn, formatDate } from "@/lib/utils";
import { groupPermissionsByFeature } from "@/lib/authContext";
import {
  BetweenHorizonalStart,
  BookSearch,
  Building,
  ChevronDown,
  ChevronUp,
  Component,
  Eye,
  LocationEdit,
  Pen,
  Pencil,
  Save,
  Trash2,
  UserRoundKey,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/core/contexts/AuthContext";
import { CreateDepartmentDialog } from "@/components/settings/CreateDepartmentDialog";
import { CreateLocationDialog } from "@/components/settings/CreateLocationDialog";
import { CreateCargoDialog } from "@/components/settings/CreateCargoDialog";
import { CreateCategoryDialog } from "@/components/settings/CreateCategoryDialog";
import { EditCategoryDialog } from "@/components/settings/EditCategoryDialog";
import { EditCargoDialog } from "@/components/settings/EditCargoDialog";
import { EditDepartmentDialog } from "@/components/settings/EditDepartmentDialog";
import { EditLocationDialog } from "@/components/settings/EditLocationDialog";
import Loader, { LoaderSmall } from "@/components/layout/Loader";
import DeleteDialog from "@/components/common/DeleteDialog";
import { toast } from "sonner";
import { PermissionDisabled } from "@/components/auth/PermissionDisabled";
import { PERMISSIONS } from "@/core/constants/permissions";

export default function Settings() {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    companyName: "",
    companyNif: "",
    companyEmail: "",
    companyPhone: "",
  });
  const [editCategoryOpen, setEditCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editCargoOpen, setEditCargoOpen] = useState(false);
  const [selectedCargo, setSelectedCargo] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [editDepartmentOpen, setEditDepartmentOpen] = useState(false);
  const [editLocationOpen, setEditLocationOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const [canEditCompanyInfo, setCanEditCompanyInfo] = useState(false);

  const [categorias, setCategorias] = useState(null);
  const [cargos, setCargos] = useState(null);
  const [departamentos, setDepartamentos] = useState(null);
  const [localizacoes, setLocalizacoes] = useState(null);

  const [expandedRow, setExpandedRow] = useState(null);
  const [departmentExpandedRow, setDepartmentExpandedRow] = useState(null);

  const [AddDepartmentOpen, setAddDepartmentOpen] = useState(false);
  const [AddLocationOpen, setAddLocationOpen] = useState(false);
  const [AddCargoOpen, setAddCargoOpen] = useState(false);
  const [AddCategoryOpen, setAddCategoryOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteAction, setDeleteAction] = useState({
    action: null,
    label: "",
  });

  // Define refresh functions
  const refreshCategorias = () => {
    request(
      "/categoria",
      "GET",
      {},
      (data) => setCategorias(data.data || []),
      (err) => {
        console.error(err);
        setCategorias(categorias ?? []);
      },
    );
  };

  const refreshCargos = () => {
    request(
      "/cargo",
      "GET",
      {},
      (data) => setCargos(data.data || []),
      (err) => {
        console.error(err);
        setCargos(cargos ?? []);
      },
    );
  };

  const refreshLocalizacoes = () => {
    request(
      "/localizacao",
      "GET",
      {},
      (data) => setLocalizacoes(data.data || []),
      (err) => {
        console.error(err);
        setLocalizacoes(localizacoes ?? []);
      },
    );
  };

  const refreshDepartamentos = () => {
    request(
      "/departamento",
      "GET",
      {},
      (data) => {
        setDepartamentos(data.data ?? []);
      },
      (err) => {
        console.error(err);
        setDepartamentos(departamentos ?? []);
      },
    );
  };
  useEffect(() => {
    // Register refresh callbacks
    refreshManager.register("categorias", refreshCategorias);
    refreshManager.register("cargos", refreshCargos);
    refreshManager.register("localizacoes", refreshLocalizacoes);
    refreshManager.register("departamentos", refreshDepartamentos);

    // Initial data load
    refreshCategorias();
    refreshCargos();
    refreshLocalizacoes();
    refreshDepartamentos();

    const f = () =>
      setFormData({
        companyName: user?.instituicao?.nome || "",
        companyNif: user?.instituicao?.nif || "",
        companyEmail: user?.instituicao?.email || "",
        companyPhone: user?.instituicao?.telefone || "",
      });
    f();

    // Cleanup on unmount
    return () => {
      refreshManager.unregister("categorias");
      refreshManager.unregister("cargos");
      refreshManager.unregister("localizacoes");
      refreshManager.unregister("departamentos");
    };
  }, [user.id]);

  useEffect(() => {
    refreshDepartamentos();
  }, [localizacoes]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDeletion = {
    category: async (id) => {
      await request(`/categoria/${id}`, "DELETE", {}, () => {
        refreshManager.refresh("categorias");
        toast.success("Categoria eliminada com sucesso");
      });
    },
    cargos: async (id) => {
      await request(`/cargos/${id}`, "DELETE", {}, () => {
        refreshManager.refresh("cargos");
        toast.success("Cargo eliminado com sucesso");
      });
    },
    localizacao: async (id) => {
      await request(`/localizacao/${id}`, "DELETE", {}, () => {
        refreshManager.refresh("localizacoes");
        toast.success("Localização eliminada com sucesso");
      });
    },
    departamento: async (id) => {
      await request(`/departamento/${id}`, "DELETE", {}, () => {
        refreshManager.refresh("departamentos");
        toast.success("Departamento eliminado com sucesso");
      });
    },
  };

  // const handleEditCompanyInfo = async (enable) => {
  //   setCanEditCompanyInfo(enable);

  //   if (enable) {
  //     if (
  //       formData.companyName === user?.instituicao?.nome &&
  //       formData.companyNif === user?.instituicao?.nif &&
  //       formData.companyEmail === user?.instituicao?.email &&
  //       formData.companyPhone === user?.instituicao?.telefone
  //     ) {
  //       return; // No changes made, just enable edit mode
  //     }

  //     if (!formData.companyName.trim()) return;
  //   }

  //   return;
  // };

  if (!user) return null;

  return (
    <PageContainer className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Configurações</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie as configurações do sistema
        </p>
      </div>
      <Card
        Icon={Building}
        title="Dados da Instituição"
        description="Detalhes da sua instituição"
        style="min-h-fit relative"
      >
        <div className="grid grid-cols-2 grid-rows-2 gap-y-4 gap-x-6">
          <div className="flex flex-col gap-1">
            <Label className="font-medium text-sm">Nome da Instituição</Label>
            <Input
              type="text"
              value={formData.companyName}
              readOnly={!canEditCompanyInfo}
              onChange={(v) =>
                handleInputChange("companyName", v.currentTarget.value)
              }
              className="bg-border/60 p-2 h-11 px-4 font-medium"
              placeholder="IPIKK"
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="font-medium text-sm">
              Nº de Identificação Fiscal
            </Label>
            <Input
              type="text"
              value={formData.companyNif}
              readOnly={!canEditCompanyInfo}
              onChange={(v) =>
                handleInputChange("companyNif", v.currentTarget.value)
              }
              className="bg-border/60 p-2 h-11 px-4 font-medium"
              placeholder="99999999LA099"
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="font-medium text-sm">E-mail de contacto</Label>
            <Input
              type="text"
              value={formData.companyEmail}
              readOnly={!canEditCompanyInfo}
              onChange={(v) =>
                handleInputChange("companyEmail", v.currentTarget.value)
              }
              className="bg-border/60 p-2 h-11 px-4 font-medium"
              placeholder="email@instituto.com"
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="font-medium text-sm">Telefone</Label>
            <Input
              type="text"
              value={formData.companyPhone}
              readOnly={!canEditCompanyInfo}
              onChange={(v) =>
                handleInputChange("companyPhone", v.currentTarget.value)
              }
              className="bg-border/60 p-2 h-11 px-4 font-medium"
              placeholder="999 999 999"
            />
          </div>
        </div>
        {/* <div className="flex items-center gap-4 flex-wrap">
          <Button
            variant="outline"
            className={cn(
              "w-fit min-h-fit h-11 py-1 px-6 rounded-lg flex items-center cursor-pointer",
              // "absolute top-8 right-8 z-1",
            )}
            onClick={() => setCanEditCompanyInfo(!canEditCompanyInfo)}
          >
            {!canEditCompanyInfo ? (
              <>
                {" "}
                <Pen className="w-4 h-4" />
                Editar
              </>
            ) : (
              <>
                <X className="w-4 h-4" /> Cancelar
              </>
            )}
          </Button>
          {canEditCompanyInfo && (
            <Button
              variant="secondary"
              disabled
              className="w-fit min-h-fit h-11 py-1 px-6 rounded-lg flex items-center cursor-pointer"
            >
              <Save className="w-4 h-4" /> Salvar
            </Button>
          )}
        </div> */}
      </Card>

      <Card
        Icon={BetweenHorizonalStart}
        title="Categorias"
        description="Criar, editar e eliminar categorias"
        actionBtn={{
          title: "Nova categoria",
          action: () => setAddCategoryOpen(true),
        }}
        actionPermission={PERMISSIONS.CATEGORIA_CREATE}
        style="max-h-140"
      >
        {categorias ? (
          <div className="flex-1 min-h-0 bg-card rounded-xl border border-border flex flex-col">
            <div className="rounded-xl flex-1 min-h-0 overflow-auto relative no-scrollbar flex flex-col">
              <table className="w-full table-fixed min-w-lg text-sm">
                <colgroup>
                  <col className="w-50" />
                  <col className="w-auto" />
                  <col className="w-auto" />
                  <col className="w-28" />
                </colgroup>
                <thead className="sticky top-0 z-10 text-lg bg-card font-semibold text-center">
                  <tr className="bg-secondary/50">
                    <td className="py-2 px-4">Última atualização</td>
                    <td className="py-2 text-left">Nome</td>
                    <td className="py-2">Descrição</td>
                    <td className="py-2 px-4">Ações</td>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {categorias?.length > 0 &&
                    categorias.map((item, index) => (
                      <tr
                        key={index}
                        className="animate-fade-in text-center hover:bg-accent/20 even:bg-accent/10"
                        style={{ animationDelay: `${index * 30}ms` }}
                      >
                        <td className="text-muted-foreground py-3">
                          {formatDate(item.updatedAt, true)}
                        </td>
                        <td className="font-medium text-left text-primary py-3 truncate">
                          {item.nome}
                        </td>
                        <td className="font-semibold py-3 truncate">
                          {item.descricao.trim() ? (
                            item.descricao
                          ) : (
                            <span className="italic text-muted-foreground">
                              Sem descrição
                            </span>
                          )}
                        </td>
                        <td className="py-2 pl-2 text-center text-primary/80">
                          <div className="flex items-center justify-center gap-1">
                            <PermissionDisabled
                              permission={PERMISSIONS.CATEGORIA_UPDATE}
                            >
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => {
                                  setSelectedCategory(item);
                                  setEditCategoryOpen(true);
                                }}
                                disabled={item.defaultType}
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                            </PermissionDisabled>
                            <PermissionDisabled
                              permission={PERMISSIONS.CATEGORIA_DELETE}
                            >
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={() => {
                                  setDeleteAction({
                                    action: () =>
                                      handleDeletion.category(item.id),
                                    label: `Eliminar a categoria: "${item.nome}"?`,
                                  });
                                  setDeleteDialogOpen(true);
                                }}
                                disabled={item.defaultType || !item.empty}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </PermissionDisabled>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              {!categorias.length && (
                <div className="w-full flex-1 flex flex-col items-center justify-center py-6">
                  <BookSearch className="w-12 h-12 text-primary" />
                  <h3 className="text-lg">
                    Todas as suas categorias aparecerão aqui
                  </h3>
                </div>
              )}
            </div>
          </div>
        ) : (
          <LoaderSmall />
        )}
      </Card>

      <Card
        Icon={UserRoundKey}
        title="Cargos"
        description="Criar, editar e eliminar cargos"
        actionBtn={{
          title: "Novo cargo",
          action: () => setAddCargoOpen(true),
        }}
        actionPermission={PERMISSIONS.CARGO_CREATE}
        style="max-h-140"
      >
        {cargos ? (
          <div className="flex-1 min-h-0 bg-card rounded-xl border border-border flex flex-col">
            <div className="rounded-xl flex-1 min-h-0 overflow-auto relative no-scrollbar flex flex-col">
              <table className="w-full table-fixed min-w-xl text-sm">
                <colgroup>
                  <col className="w-50" />
                  <col className="w-auto" />
                  <col className="w-auto" />
                  <col className="w-28" />
                </colgroup>
                <thead className="sticky top-0 z-10 text-lg bg-card font-semibold text-center">
                  <tr className="bg-secondary/50">
                    <td className="px-4 py-2 text-left">Nome</td>
                    <td className="py-2">Descrição</td>
                    <td className="py-2">Permissões</td>
                    <td className="py-2 px-4">Ações</td>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {cargos?.length > 0 &&
                    cargos.map((item, index) => (
                      <tr
                        key={index}
                        className="animate-fade-in text-center hover:bg-accent/20 even:bg-accent/10"
                        style={{ animationDelay: `${index * 30}ms` }}
                      >
                        <td className="font-medium text-left text-primary px-4 py-3 truncate">
                          {item.nome}
                        </td>
                        <td className="font-semibold py-3 truncate">
                          {item.descricao.trim() ? (
                            item.descricao
                          ) : (
                            <span className="italic text-muted-foreground">
                              Sem descrição
                            </span>
                          )}
                        </td>
                        <td
                          className="font-semibold py-3 cursor-pointer hover:text-primary/80"
                          onClick={() =>
                            setExpandedRow(expandedRow === index ? null : index)
                          }
                        >
                          <div className="flex items-center justify-center gap-3 transition ease-in-out">
                            Ver permissões{" "}
                            {expandedRow === index ? (
                              <ChevronUp className="w-5 h-5" />
                            ) : (
                              <ChevronDown className="w-5 h-5" />
                            )}{" "}
                          </div>
                        </td>
                        <td className="py-2 pl-2 text-center text-primary/80">
                          <div className="flex items-center justify-center gap-1">
                            <PermissionDisabled
                              permission={PERMISSIONS.CARGO_UPDATE}
                            >
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => {
                                  setSelectedCargo(item);
                                  setEditCargoOpen(true);
                                }}
                                disabled={item.defaultType}
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                            </PermissionDisabled>
                            <PermissionDisabled
                              permission={PERMISSIONS.CARGO_DELETE}
                            >
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={() => {
                                  setDeleteAction({
                                    action: () =>
                                      handleDeletion.cargos(item.id),
                                    label: `Eliminar o cargo: "${item.nome}"?`,
                                  });
                                  setDeleteDialogOpen(true);
                                }}
                                disabled={item.defaultType}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </PermissionDisabled>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              {!cargos.length && (
                <div className="w-full flex-1 flex flex-col items-center justify-center py-6">
                  <BookSearch className="w-12 h-12 text-primary" />
                  <h3 className="text-lg">
                    Todos os seus cargos aparecerão aqui
                  </h3>
                </div>
              )}
              {expandedRow !== null && cargos[expandedRow] && (
                <div className="w-full h-fit py-4 px-4 bg-accent/10 border-t border-border">
                  <div className="flex items-center justify-center flex-wrap gap-2">
                    {cargos[expandedRow]?.permissoes?.length ? (
                      groupPermissionsByFeature(
                        cargos[expandedRow].permissoes,
                      ).map((group, i) => (
                        <div key={i} className="flex gap-1">
                          <span className="font-bold text-sm text-primary">
                            {group.displayFeature}:
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {group.accessLevel}
                            {i === cargos[expandedRow].permissoes?.length - 1
                              ? ""
                              : ","}{" "}
                          </span>
                        </div>
                      ))
                    ) : (
                      <span className="text-center text-muted-foreground mx-auto block">
                        Nenhuma permissão atribuída a este cargo
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <LoaderSmall />
        )}
      </Card>

      <Card
        Icon={Component}
        title="Departamentos"
        description="Criar, editar e eliminar departamentos"
        actionBtn={{
          title: "Novo departamento",
          action: () => setAddDepartmentOpen(true),
        }}
        actionPermission={PERMISSIONS.DEPARTAMENTO_CREATE}
        style="max-h-140"
      >
        {departamentos ? (
          <div className="flex-1 min-h-0 bg-card rounded-xl border border-border flex flex-col">
            <div className="rounded-xl flex-1 min-h-0 overflow-auto relative no-scrollbar flex flex-col">
              <table className="w-full table-fixed min-w-lg text-sm">
                <colgroup>
                  <col className="w-50" />
                  <col className="w-auto" />
                  <col className="w-auto" />
                  <col className="w-50" />
                  <col className="w-28" />
                </colgroup>
                <thead className="sticky top-0 z-10 text-lg bg-card font-semibold text-center">
                  <tr className="bg-secondary/50">
                    <td className="py-2 px-4">Última atualização</td>
                    <td className="py-2 text-left">Nome</td>
                    <td className="py-2">Descrição</td>
                    <td className="py-2">Localizações</td>
                    <td className="py-2 px-4">Ações</td>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {departamentos?.length > 0 &&
                    departamentos.map((item, index) => (
                      <tr
                        key={index}
                        className="animate-fade-in text-center hover:bg-accent/20 even:bg-accent/10"
                        style={{ animationDelay: `${index * 30}ms` }}
                      >
                        <td className="font-medium text-left text-primary px-4 py-3 truncate">
                          {formatDate(item.updatedAt, true)}
                        </td>
                        <td className="text-left font-semibold py-3 truncate">
                          {item.nome}
                        </td>
                        <td className="font-semibold py-3 truncate">
                          {item.descricao.trim() ? (
                            item.descricao
                          ) : (
                            <span className="italic text-muted-foreground">
                              Sem descrição
                            </span>
                          )}
                        </td>
                        <td
                          className="font-semibold py-3 cursor-pointer hover:text-primary/80"
                          onClick={() =>
                            setDepartmentExpandedRow(
                              departmentExpandedRow === index ? null : index,
                            )
                          }
                        >
                          <div className="flex items-center justify-center gap-3 transition ease-in-out">
                            Localizações associadas{" "}
                            {departmentExpandedRow === index ? (
                              <ChevronUp className="w-5 h-5" />
                            ) : (
                              <ChevronDown className="w-5 h-5" />
                            )}{" "}
                          </div>
                        </td>
                        <td className="py-2 pl-2 text-center text-primary/80">
                          <div className="flex items-center justify-center gap-1">
                            <PermissionDisabled
                              permission={PERMISSIONS.DEPARTAMENTO_UPDATE}
                            >
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => {
                                  setSelectedDepartment(item);
                                  setEditDepartmentOpen(true);
                                }}
                                disabled={item.defaultType}
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                            </PermissionDisabled>
                            <PermissionDisabled
                              permission={PERMISSIONS.DEPARTAMENTO_DELETE}
                            >
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={() => {
                                  setDeleteAction({
                                    action: () =>
                                      handleDeletion.departamento(item.id),
                                    label: `Eliminar o departamento: "${item.nome}"?`,
                                  });
                                  setDeleteDialogOpen(true);
                                }}
                                disabled={item.defaultType}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </PermissionDisabled>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              {!departamentos.length && (
                <div className="w-full flex-1 flex flex-col items-center justify-center py-6">
                  <BookSearch className="w-12 h-12 text-primary" />
                  <h3 className="text-lg">
                    Todos os seus departamentos aparecerão aqui
                  </h3>
                </div>
              )}
              {departmentExpandedRow !== null &&
                departamentos[departmentExpandedRow] && (
                  <div className="w-full h-fit py-4 px-4 bg-accent/10 border-t border-border">
                    <div className="flex items-center justify-center flex-wrap gap-2">
                      {departamentos[departmentExpandedRow].salas.length ? (
                        departamentos[departmentExpandedRow].salas.map(
                          (item, i) => (
                            <div key={i} className="flex gap-1">
                              <span className="font-bold text-sm text-primary">
                                {item.nome}
                                {i ===
                                departamentos[departmentExpandedRow].salas
                                  .length -
                                  1
                                  ? ""
                                  : ","}
                              </span>
                            </div>
                          ),
                        )
                      ) : (
                        <span className="text-center text-muted-foreground mx-auto block">
                          Nenhuma localização associada a este departamento
                        </span>
                      )}
                    </div>
                  </div>
                )}
            </div>
          </div>
        ) : (
          <LoaderSmall />
        )}
      </Card>

      <Card
        Icon={LocationEdit}
        title="Localizações"
        description="Criar, editar e eliminar localizações"
        actionBtn={{
          title: "Nova localização",
          action: () => setAddLocationOpen(true),
        }}
        actionPermission={PERMISSIONS.SALA_CREATE}
        style="max-h-140"
      >
        {localizacoes ? (
          <div className="flex-1 min-h-0 bg-card rounded-xl border border-border flex flex-col">
            <div className="rounded-xl flex-1 min-h-0 overflow-auto relative no-scrollbar flex flex-col">
              <table className="w-full table-fixed min-w-lg text-sm">
                <colgroup>
                  <col className="w-50" />
                  <col className="w-auto" />
                  <col className="w-auto" />
                  <col className="w-auto" />
                  <col className="w-28" />
                </colgroup>
                <thead className="sticky top-0 z-10 text-lg bg-card font-semibold text-center">
                  <tr className="bg-secondary/50">
                    <td className="py-2 px-4">Última atualização</td>
                    <td className="py-2 text-left">Nome</td>
                    <td className="py-2">Departamento</td>
                    <td className="py-2">Tipo</td>
                    <td className="py-2 px-4">Ações</td>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {localizacoes?.length > 0 &&
                    localizacoes.map((item, index) => (
                      <tr
                        key={index}
                        className="animate-fade-in text-center hover:bg-accent/20 even:bg-accent/10"
                        style={{ animationDelay: `${index * 30}ms` }}
                      >
                        <td className="text-muted-foreground py-3">
                          {formatDate(item.updatedAt, true)}
                        </td>
                        <td className="font-medium text-left text-primary py-3 truncate">
                          {item.nome}
                        </td>
                        <td className="font-semibold py-3 truncate">
                          {item.departamento ?? "Sem departamento"}
                        </td>
                        <td className="font-semibold py-3 truncate">
                          {item.tipo}
                        </td>
                        <td className="py-2 pl-2 text-center text-primary/80">
                          <div className="flex items-center justify-center gap-1">
                            <PermissionDisabled
                              permission={PERMISSIONS.SALA_UPDATE}
                            >
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => {
                                  setSelectedLocation(item);
                                  setEditLocationOpen(true);
                                }}
                                disabled={item.defaultType}
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                            </PermissionDisabled>
                            <PermissionDisabled
                              permission={PERMISSIONS.SALA_DELETE}
                            >
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={() => {
                                  setDeleteAction({
                                    action: () =>
                                      handleDeletion.localizacao(item.id),
                                    label: `Eliminar a localização: "${item.nome}"?`,
                                  });
                                  setDeleteDialogOpen(true);
                                }}
                                disabled={item.defaultType}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </PermissionDisabled>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              {!localizacoes.length && (
                <div className="w-full flex-1 flex flex-col items-center justify-center py-6">
                  <BookSearch className="w-12 h-12 text-primary" />
                  <h3 className="text-lg">
                    Todas as suas localizações aparecerão aqui
                  </h3>
                </div>
              )}
            </div>
          </div>
        ) : (
          <LoaderSmall />
        )}
      </Card>

      <CreateDepartmentDialog
        open={AddDepartmentOpen}
        onOpenChange={setAddDepartmentOpen}
      />
      <CreateLocationDialog
        open={AddLocationOpen}
        onOpenChange={setAddLocationOpen}
        departaments={departamentos ?? []}
      />
      <CreateCargoDialog open={AddCargoOpen} onOpenChange={setAddCargoOpen} />
      <CreateCategoryDialog
        open={AddCategoryOpen}
        onOpenChange={setAddCategoryOpen}
      />
      <EditCategoryDialog
        open={editCategoryOpen}
        onOpenChange={setEditCategoryOpen}
        category={selectedCategory}
      />
      <EditCargoDialog
        open={editCargoOpen}
        onOpenChange={setEditCargoOpen}
        cargo={selectedCargo}
      />
      <EditDepartmentDialog
        open={editDepartmentOpen}
        onOpenChange={setEditDepartmentOpen}
        department={selectedDepartment}
      />
      <EditLocationDialog
        open={editLocationOpen}
        onOpenChange={setEditLocationOpen}
        location={selectedLocation}
        departaments={departamentos}
      />
      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={() => deleteAction.action?.()}
        title={deleteAction?.label ?? "Eliminar este item?"}
        description="Atenção! Esta ação não pode ser desfeita."
      />
    </PageContainer>
  );
}

const Card = ({
  children,
  title,
  description,
  Icon,
  actionBtn,
  actionPermission,
  style,
}) => {
  return (
    <section
      className={cn(
        "w-full min-h-fit max-h-[80dvh] p-8 flex flex-col gap-6 bg-card rounded-xl border border-border shadow-xs shadow-blue-200 transition ease-in hover:-translate-y-0.5 overflow-hidden",
        style,
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center justify-start gap-4">
          <span className="w-fit h-fit rounded-lg flex items-center justify-center p-3 bg-accent/60 text-ring">
            {<Icon className="w-7 h-7" />}
          </span>
          <div>
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="text-muted-foreground">{description}</p>
          </div>
        </div>
        {actionBtn && (
          <PermissionDisabled permission={actionPermission}>
            <Button
              variant="outline"
              className="w-fit min-h-fit h-11 py-1 px-6 rounded-lg flex items-center cursor-pointer"
              onClick={actionBtn.action ?? undefined}
            >
              {actionBtn.title ?? ""}
            </Button>
          </PermissionDisabled>
        )}
      </div>
      <span className="w-full h-0.5 bg-border" />
      <>{children}</>
    </section>
  );
};
