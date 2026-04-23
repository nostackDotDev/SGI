import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { BookSearch, SearchX } from "lucide-react";

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

export default function CheckInOutTable({ data, filters }) {
  const filtered = data.filter((m) => {
    const matchesSearch =
      m.article
        .toLowerCase()
        .includes(filters.searchTerm.toLowerCase().trim()) ||
      m.user.toLowerCase().includes(filters.searchTerm.toLowerCase().trim());
    const matchesType = filters.type === "all" || m.type === filters.type;
    return matchesSearch && matchesType;
  });

  return (
    <div className="flex-1 min-h-0 bg-card rounded-xl border border-border flex flex-col">
      <div className="rounded-xl flex-1 min-h-0 overflow-auto relative no-scrollbar flex flex-col">
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
