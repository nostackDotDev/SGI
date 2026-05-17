import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BookSearch, CalendarIcon, Search, SearchX } from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";
import CheckInOutTable from "@/components/checkInOut/CheckInOutTable";
import { refreshManager, request } from "@/lib/request";
import Loader from "@/components/layout/Loader";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

export default function CheckInOut() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateRange, setDateRange] = useState(undefined);
  const [records, setRecords] = useState(null);

  const refreshRecords = () => {
    request(
      "/registo",
      "GET",
      {
        params: {
          startDate: dateRange?.from,
          endDate: dateRange?.to,
        },
      },
      (data) => setRecords(data.data || []),
      (err) => {
        console.error(err);
      },
    );
  };

  useEffect(() => {
    refreshManager.register("registos", refreshRecords);
    refreshRecords();
    return () => refreshManager.unregister("registos");
  }, []);

  useEffect(() => {
    refreshRecords();
  }, [dateRange]);

  return (
    <PageContainer className="grid grid-rows-[auto_1fr] gap-6">
      <div>
        <h1 className="text-2xl font-bold">Movimentações</h1>
        <p className="text-muted-foreground mt-1">
          Histórico das entradas e saídas de estoque
        </p>
      </div>

      <div className="flex flex-col gap-4 overflow-hidden">
        {/* Filters */}
        <div className="card-elevated p-6 flex flex-col sm:flex-row sm:items-end gap-4 px-4">
          <div className="space-y-2 flex-1">
            <Label htmlFor="search-filter">Pesquisar</Label>
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="search-filter"
                placeholder="Pesquisar por item, data ou utilizador..."
                className="pl-9 h-11 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="type-filter">Tipo</Label>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger id="type-filter" className="w-full sm:w-45 py-5">
                <SelectValue placeholder="Todos os tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="in">Entradas</SelectItem>
                <SelectItem value="out">Saídas</SelectItem>
                <SelectItem value="transfer">Transferências</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Date Range */}
          <div className="space-y-2">
            <Label htmlFor="date-filter">Período</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date-filter"
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
        </div>

        {/* Table */}
        {records ? (
          <CheckInOutTable
            data={records.sort((a, b) => new Date(b?.date) - new Date(a?.date))}
            filters={{
              searchTerm,
              type: typeFilter,
            }}
            pageSize={15}
          />
        ) : (
          <Loader />
        )}
      </div>
    </PageContainer>
  );
}
