import { useEffect, useMemo, useRef, useState } from "react";
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
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR, se } from "date-fns/locale";
import { cn, formatDate, syncScroll } from "@/lib/utils";
import PageContainer from "@/components/layout/PageContainer";
import { request } from "@/lib/request";
import { toast } from "sonner";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { ReportPDFDocument } from "@/components/reports/ReportPDFDocument";
import { useAuth } from "@/core/contexts/AuthContext";

const reportTypes = [
  { value: "inventory_summary", label: "Resumo do Inventário", icon: Package },
  // { value: "usage", label: "Histórico de Uso", icon: TrendingUp },
  // { value: "low-stock", label: "Estoque Baixo", icon: AlertTriangle },
];

export default function Reports() {
  const { user, institution } = useAuth();
  const [report, setReport] = useState(null);
  const [reportType, setReportType] = useState("none");
  const [dateRange, setDateRange] = useState(undefined);
  const [canGenerateReport, setCanGenerateReport] = useState(false);
  const [isReportLoading, setIsReportLoading] = useState(false);
  const topScrollRef = useRef(null);
  const bottomScrollRef = useRef(null);
  // const pdfLinkRef = useRef(null);

  const canGenerate = useMemo(
    () => reportType !== "none" && dateRange,
    [reportType, dateRange],
  );

  const generateReport = () => {
    setIsReportLoading(true);
    request(
      "/relatorio/create",
      "POST",
      {
        data: {
          type: reportType,
          startDate: dateRange.from,
          endDate: dateRange.to,
        },
      },
      (res) => {
        setReport(res.data || null);
        setIsReportLoading(false);
        toast.success(res.message || "Relatório gerado com sucesso", {
          id: "fetch-toast",
          position: "bottom-right",
        });
      },
      (err) => {
        console.error(err);
        setIsReportLoading(false);
        toast.error(err?.message || "Ocorreu um erro ao gerar o relatório", {
          id: "fetch-toast",
          position: "bottom-right",
        });
        setReport(report ?? null);
      },
    );
  };
  useEffect(() => {
    const f = () => {
      setCanGenerateReport(false);

      if (canGenerate) {
        setCanGenerateReport(true);
        return;
      }

      if (reportType === "none") setReport(null);
      return;
    };
    f();
  }, [canGenerate]);

  const reportDisabled = useMemo(() => {
    if (isReportLoading) return true;
    if (!report) return true;
    return false;
  }, [isReportLoading, report]);

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
            <Button
              className="w-full py-5"
              disabled={!canGenerateReport}
              onClick={generateReport}
            >
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
            <h3 className="font-semibold text-lg">
              {reportTypes.find((t) => t.value === reportType)?.label ||
                "Tipo de Relatório"}
            </h3>
            <p className="text-sm text-muted-foreground">
              Gerado em: {formatDate(report?.generatedAt) || "N/A"}
            </p>
          </div>
          {report ? (
            <PDFDownloadLink
              document={
                <ReportPDFDocument
                  report={report}
                  institution={user?.instituicao}
                  user={user}
                />
              }
              fileName={`relatorio${report.id}_${new Date().toLocaleString().replace("_", "-").replace(", ", "_")}.pdf`}
              className="w-fit h-fit bg-transparent transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {({ loading }) =>
                loading ? (
                  <Button
                    type="button"
                    variant="destructive"
                    size="lg"
                    disabled
                    className="transition-transform px-6"
                  >
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Gerando PDF...
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="default"
                    size="lg"
                    className="transition-transform px-6"
                  >
                    <FileText className="w-4 h-4" />
                    Exportar PDF
                  </Button>
                )
              }
            </PDFDownloadLink>
          ) : (
            <Button
              type="button"
              variant="destructive"
              size="lg"
              disabled
              className="transition-transform px-6"
            >
              <FileText className="w-4 h-4" />
              Exportar PDF
            </Button>
          )}
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
                {report?.categories.map((row, index) => (
                  <tr
                    key={index}
                    className="animate-fade-in transition-colors hover:bg-accent/20 even:bg-accent/10"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="font-medium py-3 px-4">{row.nome}</td>
                    <td className="text-right py-3">{row.total}</td>
                    <td className="text-right py-3 text-success">
                      {row.available}
                    </td>
                    <td className="text-right py-3 text-warning">
                      {row.borrowed}
                    </td>
                    <td className="text-right py-3 px-4 text-destructive">
                      {row.repair}
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
                  <td className="text-right">{report?.totals.total || 0}</td>
                  <td className="text-right text-success">
                    {report?.totals.available || 0}
                  </td>
                  <td className="text-right text-warning">
                    {report?.totals.borrowed || 0}
                  </td>
                  <td className="text-right px-4 text-destructive">
                    {report?.totals.repair || 0}
                  </td>
                </tr>
              </thead>
            </table>
          </div>
        </div>

        {/* <div className="p-4 self-end">
          <Button type="button" size="lg" className="py-6 px-4">
            <Download className="w-4 h-4 mr-2" />
            Exportar Relatório
          </Button>
        </div> */}
      </div>
    </PageContainer>
  );
}
