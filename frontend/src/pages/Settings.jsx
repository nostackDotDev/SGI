import PageContainer from "@/components/layout/PageContainer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building } from "lucide-react";
import { useState } from "react";

export default function Settings() {
  const [formData, setFormData] = useState({
    companyName: "",
    companyNif: "",
    companyEmail: "",
    companyPhone: "",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <PageContainer className="grid grid-rows-[auto_auto_1fr] gap-6">
      <div>
        <h1 className="text-2xl font-bold">Configurações</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie as configurações do sistema
        </p>
      </div>
      <Card
        Icon={Building}
        title="Dados da Empresa"
        description="Informações básicas da organização"
      >
        <div className="grid grid-cols-2 grid-rows-2 gap-y-4 gap-x-6">
          <div className="flex flex-col gap-1">
            <Label className="font-medium text-sm">Nome da Instituição</Label>
            <Input
              type="text"
              value={formData.companyName}
              onChange={(v) =>
                handleInputChange("companyName", v.currentTarget.value)
              }
              className="bg-border/60 p-2 h-11 px-4"
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
              onChange={(v) =>
                handleInputChange("companyNif", v.currentTarget.value)
              }
              className="bg-border/60 p-2 h-11 px-4"
              placeholder="99999999LA099"
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="font-medium text-sm">E-mail de contacto</Label>
            <Input
              type="text"
              value={formData.companyEmail}
              onChange={(v) =>
                handleInputChange("companyEmail", v.currentTarget.value)
              }
              className="bg-border/60 p-2 h-11 px-4"
              placeholder="email@instituto.com"
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="font-medium text-sm">Telefone</Label>
            <Input
              type="text"
              value={formData.companyPhone}
              onChange={(v) =>
                handleInputChange("companyPhone", v.currentTarget.value)
              }
              className="bg-border/60 p-2 h-11 px-4"
              placeholder="999 999 999"
            />
          </div>
        </div>
      </Card>
    </PageContainer>
  );
}

const Card = ({ children, title, description, Icon }) => {
  return (
    <section className="w-full h-fit p-8 flex flex-col gap-6 bg-card rounded-xl border border-border shadow-xs shadow-blue-200 transition-transform ease-in hover:-translate-y-0.5">
      <div className="flex items-center justify-start gap-4">
        <span className="w-fit h-fit rounded-lg flex items-center justify-center p-3 bg-accent/60 text-ring">
          {<Icon className="w-7 h-7" />}
        </span>
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>
      <span className="w-full h-0.5 bg-border" />
      <>{children}</>
    </section>
  );
};
