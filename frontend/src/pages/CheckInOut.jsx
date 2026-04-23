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
import PageContainer from "@/components/layout/PageContainer";
import CheckInOutTable from "@/components/checkInOut/CheckInOutTable";

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

export default function CheckInOut() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
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
        <div className="card-elevated p-6 flex flex-col sm:flex-row gap-4 px-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar por artigo ou utilizador..."
              className="pl-9 h-11"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
        <CheckInOutTable
          data={mockMovements}
          filters={{
            searchTerm,
            type: typeFilter,
          }}
        />
      </div>
    </PageContainer>
  );
}
