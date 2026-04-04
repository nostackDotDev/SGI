import { useState } from "react";
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
import { BookSearch, Search, SearchX } from "lucide-react";
import { cn } from "@/lib/utils";
import PageContainer from "@/components/layout/PageContainer";

const mockMovements = [
  {
    id: "1",
    date: "2026-03-08",
    article: "Notebook Dell XPS 15",
    type: "entrada",
    quantity: 10,
    user: "João Silva",
    reason: "Entrega fornecedor",
  },
  {
    id: "2",
    date: "2026-03-07",
    article: 'Monitor LG 27"',
    type: "saida",
    quantity: 3,
    user: "Maria Santos",
    reason: "Distribuição escritório",
  },
  {
    id: "3",
    date: "2026-03-05",
    article: "Teclado Mecânico",
    type: "saida",
    quantity: 5,
    user: "João Silva",
    reason: "Transferência filial",
  },
  {
    id: "4",
    date: "2026-03-09",
    article: "Mouse Wireless",
    type: "saida",
    quantity: 2,
    user: "Pedro Costa",
    reason: "Empréstimo equipe",
  },
  {
    id: "5",
    date: "2026-03-03",
    article: "Webcam HD",
    type: "entrada",
    quantity: 15,
    user: "Maria Santos",
    reason: "Compra novo estoque",
  },
  {
    id: "6",
    date: "2026-03-08",
    article: "Headset Profissional",
    type: "entrada",
    quantity: 20,
    user: "Ana Oliveira",
    reason: "Reabastecimento",
  },
  {
    id: "7",
    date: "2026-03-09",
    article: "Cabo HDMI 2m",
    type: "saida",
    quantity: 10,
    user: "João Silva",
    reason: "Uso semanal",
  },
  {
    id: "8",
    date: "2026-03-01",
    article: "Adaptador USB-C",
    type: "saida",
    quantity: 1,
    user: "Pedro Costa",
    reason: "Reparo",
  },
  {
    id: "9",
    date: "2026-03-06",
    article: 'Monitor LG 27"',
    type: "entrada",
    quantity: 8,
    user: "Ana Oliveira",
    reason: "Entrega fornecedor",
  },
  {
    id: "10",
    date: "2026-03-02",
    article: "Notebook Dell XPS 15",
    type: "saida",
    quantity: 1,
    user: "Maria Santos",
    reason: "Fora de serviço",
  },
];

const typeConfig = {
  entrada: {
    label: "Entrada",
    className: "bg-primary/10 text-primary border-primary/20",
  },
  saida: {
    label: "Saída",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
};

export default function CheckInOut() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const filtered = mockMovements.filter((m) => {
    const matchesSearch =
      m.article.toLowerCase().includes(search.toLowerCase().trim()) ||
      m.user.toLowerCase().includes(search.toLowerCase().trim());
    const matchesType = typeFilter === "all" || m.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <PageContainer className="grid grid-rows-[auto_1fr] gap-6">
      <div>
        <h1 className="text-2xl font-bold">Movimentações</h1>
        <p className="text-muted-foreground mt-1">
          Histórico das entradas e saídas de estoque
        </p>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-card py-6 flex flex-col gap-4 overflow-hidden">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 px-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar por artigo ou utilizador..."
              className="pl-9 h-11"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-45 py-5">
              <SelectValue placeholder="Todos os tipos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="entrada">Entrada</SelectItem>
              <SelectItem value="saida">Saída</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="flex-1 min-h-0 overflow-auto relative no-scrollbar flex flex-col">
          <table className="w-full table-fixed min-w-4xl text-sm">
            <colgroup>
              <col className="w-28" />
              <col className="w-auto" />
              <col className="w-28" />
              <col className="w-28" />
              <col className="w-auto" />
              <col className="w-auto" />
            </colgroup>
            <thead className="sticky top-0 z-10 text-lg bg-card font-semibold text-center">
              <tr className="bg-secondary/50">
                <td className="py-2 px-4">Data</td>
                <td className="py-2">Item</td>
                <td className="py-2">Tipo</td>
                <td className="py-2">Quantidade</td>
                <td className="py-2">Utilizador</td>
                <td className="py-2 px-4">Motivo</td>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((item, index) => (
                <tr
                  key={index}
                  className="animate-fade-in text-center hover:bg-accent/20 even:bg-accent/10"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <td className="text-muted-foreground py-3">{item.date}</td>
                  <td className="font-medium text-primary py-3">
                    {item.article}
                  </td>
                  <td className="py-3">
                    <Badge
                      variant="outline"
                      className={cn(
                        "font-medium p-3",
                        typeConfig[item.type].className,
                      )}
                    >
                      {typeConfig[item.type].label}
                    </Badge>
                  </td>
                  <td className="font-semibold py-3">{item.quantity}</td>
                  <td className="text-muted-foreground py-3">{item.user}</td>
                  <td className="text-primary/80 py-2">{item.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!mockMovements?.length && (
            <div className="w-full flex-1 flex flex-col items-center justify-center">
              <BookSearch className="w-20 h-20 text-primary" />
              <h3 className="text-lg">
                Todas as movimentações aparecerão aqui
              </h3>
            </div>
          )}
          {mockMovements?.length > 0 && !filtered?.length && (
            <div className="w-full flex-1 flex flex-col items-center justify-center">
              <SearchX className="w-20 h-20 text-destructive" />
              <h3 className="text-lg text-muted-foreground">
                Nenhum item encontrado
              </h3>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
