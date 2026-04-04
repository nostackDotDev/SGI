import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CalendarIcon,
  FileSpreadsheet,
  FileText,
  Download,
  BarChart3,
  Package,
  TrendingUp,
  AlertTriangle,
  Search,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn, syncScroll } from "@/lib/utils";
import PageContainer from "@/components/layout/PageContainer";

const reportTypes = [
  { value: "inventory", label: "Resumo do Inventário", icon: Package },
  // { value: "usage", label: "Histórico de Uso", icon: TrendingUp },
  // { value: "low-stock", label: "Estoque Baixo", icon: AlertTriangle },
];

const mockReportData = [
  {
    category: "Eletrônicos",
    total: 45,
    available: 38,
    checkedOut: 5,
    maintenance: 2,
  },
  {
    category: "Periféricos",
    total: 120,
    available: 105,
    checkedOut: 12,
    maintenance: 3,
  },
  {
    category: "Áudio",
    total: 30,
    available: 25,
    checkedOut: 4,
    maintenance: 1,
  },
  {
    category: "Cabos",
    total: 200,
    available: 180,
    checkedOut: 15,
    maintenance: 5,
  },
  {
    category: "Adaptadores",
    total: 80,
    available: 72,
    checkedOut: 6,
    maintenance: 2,
  },
];

export default function Reports() {
  const [reportType, setReportType] = useState("none");
  const [dateRange, setDateRange] = useState(undefined);
  const [canGenerateReport, setCanGenerateReport] = useState(false);

  const topScrollRef = useRef(null);
  const bottomScrollRef = useRef(null);

  useEffect(() => {
    const f = () => {
      setCanGenerateReport(false);
      if (reportType !== "none" && dateRange !== undefined) {
        setCanGenerateReport(true);
        return;
      }
    };
    f();
  }, [reportType, dateRange]);

  return (
    <PageContainer className="grid grid-rows-[auto_auto_1fr] gap-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">Relatórios</h1>
        <p className="text-muted-foreground mt-1">
          Gere relatórios detalhados do seu inventário
        </p>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-xl border border-border shadow-card p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Report Type */}
          <div className="space-y-2">
            <Label>Tipo de Relatório</Label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="w-full py-5">
                <SelectValue placeholder="Selecionar tipo de relatório" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">
                  <div className="flex items-center gap-2">Selecionar</div>
                </SelectItem>
                {reportTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      <type.icon className="w-4 h-4" />
                      {type.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <Label>Período</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal py-5",
                    !dateRange && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "dd/MM/yy", { locale: ptBR })} -{" "}
                        {format(dateRange.to, "dd/MM/yy", { locale: ptBR })}
                      </>
                    ) : (
                      format(dateRange.from, "PPP", { locale: ptBR })
                    )
                  ) : (
                    "Selecione o período"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                  locale={ptBR}
                  showOutsideDays={false}
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Generate Button */}
          <div className="self-end space-y-2">
            {/* <Label className="invisible">Gerar</Label> */}
            <Button className="w-full py-5" disabled={!canGenerateReport}>
              <BarChart3 className="w-4 h-4" />
              Gerar Relatório
            </Button>
          </div>
        </div>
      </div>

      {/* Report Preview */}
      <div className=" bg-card rounded-xl border border-border shadow-card flex flex-col min-h-120 overflow-hidden">
        <div className="w-full p-6 px-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg">Resumo do Inventário</h3>
            <p className="text-sm text-muted-foreground">
              Gerado em{" "}
              {format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="lg"
              disabled
              className="bg-destructive text-muted hover:bg-destructive hover:text-muted transition-transform hover:scale-105 px-6"
            >
              <FileText className="w-4 h-4" />
              PDF
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              disabled
              className="bg-success text-muted hover:bg-success hover:text-muted transition-transform hover:scale-105 px-6"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Excel
            </Button>
          </div>
        </div>

        <div className="flex flex-col flex-1 min-h-0 min-w-0">
          <div
            ref={topScrollRef}
            onScroll={() => syncScroll(topScrollRef, bottomScrollRef)}
            className="flex-1 overflow-auto no-scrollbar"
          >
            <table className="w-full min-w-2xl table-fixed">
              <thead className="sticky top-0 z-10 text-lg bg-card">
                <tr className="bg-secondary/50">
                  <th className="font-semibold py-2 px-4 text-left">
                    Categoria
                  </th>
                  <th className="font-semibold py-2 text-right">Total</th>
                  <th className="font-semibold py-2 text-right">Disponível</th>
                  <th className="font-semibold py-2 text-right">Emprestado</th>
                  <th className="font-semibold py-2 px-4 text-right">
                    Manutenção
                  </th>
                </tr>
              </thead>
              <tbody className="h-full">
                {mockReportData.map((row, index) => (
                  <tr
                    key={index}
                    className="animate-fade-in transition-colors hover:bg-accent/20 even:bg-accent/10"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="font-medium py-3 px-4">{row.category}</td>
                    <td className="text-right py-3">{row.total}</td>
                    <td className="text-right py-3 text-success">
                      {row.available}
                    </td>
                    <td className="text-right py-3 text-warning">
                      {row.checkedOut}
                    </td>
                    <td className="text-right py-3 px-4 text-destructive">
                      {row.maintenance}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div
            ref={bottomScrollRef}
            onScroll={() => syncScroll(bottomScrollRef, topScrollRef)}
            className="h-fit overflow-x-auto no-scrollbar"
          >
            <table className="w-full min-w-2xl table-fixed">
              <thead>
                <tr className="border-t border-border font-semibold bg-accent/30 hover:bg-accent/10">
                  <td className="py-4 px-4">Total Geral</td>
                  <td className="text-right">
                    {mockReportData.reduce((acc, row) => acc + row.total, 0)}
                  </td>
                  <td className="text-right text-success">
                    {mockReportData.reduce(
                      (acc, row) => acc + row.available,
                      0,
                    )}
                  </td>
                  <td className="text-right text-warning">
                    {mockReportData.reduce(
                      (acc, row) => acc + row.checkedOut,
                      0,
                    )}
                  </td>
                  <td className="text-right px-4 text-destructive">
                    {mockReportData.reduce(
                      (acc, row) => acc + row.maintenance,
                      0,
                    )}
                  </td>
                </tr>
              </thead>
            </table>
          </div>
        </div>

        <div className="p-4 self-end">
          <Button type="button" size="lg" className="py-6 px-4">
            <Download className="w-4 h-4 mr-2" />
            Exportar Relatório
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}
