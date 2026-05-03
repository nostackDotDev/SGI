import { cn, formatDate } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { BookSearch, SearchX } from "lucide-react";

const typeConfig = {
  in: {
    label: "Entrada",
    className: "bg-primary/10 text-primary border-primary/20",
  },
  transfer: {
    label: "Transferência",
    className: "bg-muted/30 text-muuted border-muted-foreground/40",
  },
  out: {
    label: "Saída",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
};

export default function CheckInOutTable({ data, filters }) {
  const filtered = data.filter((rec) => {
    const matchesSearch =
      rec.item.nome
        .toLowerCase()
        .includes(filters.searchTerm.toLowerCase().trim()) ||
      rec.utilizador.nome
        .toLowerCase()
        .includes(filters.searchTerm.toLowerCase().trim()) ||
      formatDate(rec.date).includes(filters.searchTerm.trim());

    const matchesType = filters.type === "all" || rec.type === filters.type;
    return matchesSearch && matchesType;
  });

  return (
    <div className="flex-1 min-h-0 bg-card rounded-xl border border-border flex flex-col animate-in duration-300 ease-in">
      <div className="rounded-xl flex-1 min-h-0 overflow-auto relative no-scrollbar flex flex-col">
        <table className="w-full table-fixed min-w-4xl text-sm">
          <colgroup>
            <col className="w-28" />
            <col className="w-auto" />
            <col className="w-32" />
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
              <td className="py-2">Registado por</td>
              <td className="py-2 px-4">Motivo</td>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((entry, index) => (
              <tr
                key={index}
                className="animate-fade-in text-center hover:bg-accent/20 even:bg-accent/10"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <td className="text-muted-foreground py-3">
                  {formatDate(entry.date)}
                </td>
                <td className="font-medium text-primary py-3">
                  {entry.item.nome}
                </td>
                <td className="py-3">
                  <Badge
                    variant="outline"
                    className={cn(
                      "font-medium p-3",
                      typeConfig[entry.type].className,
                    )}
                  >
                    {typeConfig[entry.type].label}
                  </Badge>
                </td>
                <td className="font-semibold py-3">{entry.item.quantidade}</td>
                <td className="text-muted-foreground py-3">
                  {entry.utilizador.nome}
                </td>
                <td className="text-primary/80 py-2">{entry.reason ?? ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!data?.length && (
          <div className="w-full flex-1 flex flex-col items-center justify-center">
            <BookSearch className="w-20 h-20 text-primary" />
            <h3 className="text-lg">Todas as movimentações aparecerão aqui</h3>
          </div>
        )}
        {data?.length > 0 && !filtered?.length && (
          <div className="w-full flex-1 flex flex-col items-center justify-center">
            <SearchX className="w-20 h-20 text-destructive" />
            <h3 className="text-lg text-muted-foreground">
              Nenhum item encontrado
            </h3>
          </div>
        )}
      </div>
    </div>
  );
}
