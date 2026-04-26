import PageContainer from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { request } from "@/lib/request";
import { cn, formatDate } from "@/lib/utils";
import { groupPermissionsByFeature } from "@/lib/authContext";
import {
  BetweenHorizonalStart,
  BookSearch,
  Building,
  ChevronDown,
  ChevronUp,
  LocationEdit,
  Pen,
  Save,
  UserRoundKey,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/core/contexts/AuthContext";
import { CreateDepartmentDialog } from "@/components/settings/CreateDepartmentDialog";
import { CreateLocationDialog } from "@/components/settings/CreateLocationDialog";

export default function Settings() {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    companyName: "",
    companyNif: "",
    companyEmail: "",
    companyPhone: "",
  });
  const [canEditCompanyInfo, setCanEditCompanyInfo] = useState(false);

  const [categorias, setCategorias] = useState([]);
  const [cargos, setCargos] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [localizacoes, setLocalizacoes] = useState([]);

  const [expandedRow, setExpandedRow] = useState(null);
  const [departmentExpandedRow, setDepartmentExpandedRow] = useState(null);

  const [AddDepartmentOpen, setAddDepartmentOpen] = useState(false);
  const [AddLocationOpen, setAddLocationOpen] = useState(false);

  useEffect(() => {
    request(
      "/categoria",
      "GET",
      {},
      (data) => setCategorias(data.data || []),
      (err) => {
        setCategorias([]);
        console.error(err);
      },
    );
    request(
      "/cargo",
      "GET",
      {},
      (data) => setCargos(data.data || []),
      (err) => {
        setCargos([]);
        console.error(err);
      },
    );
    request(
      "/localizacao",
      "GET",
      {},
      (data) => setLocalizacoes(data.data || []),
      (err) => {
        setLocalizacoes([]);
        console.error(err);
      },
    );

    request(
      "/departamento",
      "GET",
      {},
      (data) => setDepartamentos(data.data || []),
      (err) => {
        setDepartamentos([]);
        console.error(err);
      },
    );
    const f = () =>
      setFormData({
        companyName: user?.instituicao?.nome || "",
        companyNif: user?.instituicao?.nif || "",
        companyEmail: user?.instituicao?.email || "",
        companyPhone: user?.instituicao?.telefone || "",
      });
    f();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
        <div className="flex items-center gap-4 flex-wrap">
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
        </div>
      </Card>

      <Card
        Icon={BetweenHorizonalStart}
        title="Categorias"
        description="Criar, editar e eliminar categorias"
        actionBtn={{
          title: "Nova categoria",
          // action: () => console.log("WASD"),
        }}
      >
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
                        {formatDate(item.createdAt, true)}
                      </td>
                      <td className="font-medium text-left text-primary py-3 truncate">
                        {item.nome}
                      </td>
                      <td className="font-semibold py-3 truncate">
                        {item.descricao}
                      </td>
                      <td className="text-primary/80 py-2">
                        {
                          item.id === 1
                            ? ""
                            : "Opções" /* Esconder opções da categoria padrão */
                        }
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
      </Card>

      <Card
        Icon={UserRoundKey}
        title="Cargos"
        description="Criar, editar e eliminar cargos"
        actionBtn={{
          title: "Novo cargo",
          // action: () => console.log("WASD"),
        }}
      >
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
                        {item.descricao}
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
                      <td className="text-primary/80 py-2">
                        {
                          item.id === 1
                            ? ""
                            : "Opções" /* Esconder opções do cargo admin */
                        }
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
                  {cargos[expandedRow]?.permissions?.length ? (
                    groupPermissionsByFeature(
                      cargos[expandedRow].permissions,
                    ).map((group, i) => (
                      <div key={i} className="flex gap-1">
                        <span className="font-bold text-sm text-primary">
                          {group.displayFeature}:
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {group.accessLevel}
                          {i === cargos[expandedRow].permissions?.length - 1
                            ? "wasd"
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
      </Card>

      <Card
        Icon={UserRoundKey}
        title="Departamentos"
        description="Criar, editar e eliminar departamentos"
        actionBtn={{
          title: "Novo departamento",
          action: () => setAddDepartmentOpen(true),
        }}
      >
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
                        {item.descricao}
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
                      <td className="text-primary/80 py-2">Opções</td>
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
      </Card>

      <Card
        Icon={LocationEdit}
        title="Localizações"
        description="Criar, editar e eliminar localizações"
        actionBtn={{
          title: "Nova localização",
          action: () => setAddLocationOpen(true),
        }}
      >
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
                      <td className="text-primary/80 py-2">
                        {
                          item.id === 1
                            ? ""
                            : "Opções" /* Esconder opções da localização padrão */
                        }
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
      </Card>

      <CreateDepartmentDialog
        open={AddDepartmentOpen}
        onOpenChange={setAddDepartmentOpen}
      />
      <CreateLocationDialog
        open={AddLocationOpen}
        onOpenChange={setAddLocationOpen}
        departaments={departamentos}
      />
    </PageContainer>
  );
}

const Card = ({ children, title, description, Icon, actionBtn, style }) => {
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
          <Button
            variant="outline"
            className="w-fit min-h-fit h-11 py-1 px-6 rounded-lg flex items-center cursor-pointer"
            onClick={actionBtn.action ?? undefined}
          >
            {actionBtn.title ?? ""}
          </Button>
        )}
      </div>
      <span className="w-full h-0.5 bg-border" />
      <>{children}</>
    </section>
  );
};
