import { cn, formatDate } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { BookSearch, ChevronLeft, ChevronRight, SearchX } from "lucide-react";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Button } from "../ui/button";

const typeConfig = {
  in: {
    label: "Entrada",
    className: "bg-primary/10 text-primary border-primary/20",
  },
  transfer: {
    label: "Transferência",
    className: "bg-muted/30 text-muted-foreground border-muted-foreground/40",
  },
  out: {
    label: "Saída",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
  return: {
    label: "Devolução",
    className: "bg-primary/10 text-primary border-primary/20",
  },
  restore: {
    label: "Restauração",
    className: "bg-primary/10 text-primary border-primary/20",
  },
  exit: {
    label: "Saída",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
};

export default function CheckInOutTable({ data, filters, pageSize }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = pageSize ?? 35;
  const filteredData = data.filter((rec) => {
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
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = useMemo(() => {
    if (!filteredData?.length) return [];

    return filteredData?.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, itemsPerPage, startIndex]);

  const totalPages = Math.ceil(filteredData?.length / itemsPerPage);
  const paginationItems = (() => {
    const items = [];

    if (currentPage > 2) {
      items.push(1);
      if (currentPage > 3) items.push("start-ellipsis");
    }

    if (currentPage > 1) items.push(currentPage - 1);

    items.push(currentPage);

    if (currentPage < totalPages) items.push(currentPage + 1);

    if (currentPage < totalPages - 1) {
      if (currentPage < totalPages - 2) items.push("end-ellipsis");
      items.push(totalPages);
    }

    return items;
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-xl border border-border overflow-hidden grid grid-rows-[1fr_auto] glass-card flex-1"
    >
      <div className="overflow-auto relative no-scrollbar flex flex-col">
        <table className="w-full table-fixed min-w-4xl text-sm">
          <colgroup>
            <col className="w-40" />
            <col className="w-auto" />
            <col className="w-32" />
            <col className="w-28" />
            <col className="w-auto" />
            <col className="w-auto" />
          </colgroup>
          <thead className="sticky top-0 z-10 text-sm font-medium uppercase text-muted-foreground text-center bg-card backdrop-blur-2xl shadow-xs">
            <tr className="border-b border-border/40">
              <td className="px-5 py-3">Data</td>
              <td className="px-5 py-3">Item</td>
              <td className="px-5 py-3">Tipo</td>
              <td className="px-5 py-3">Quantidade</td>
              <td className="px-5 py-3">Registado por</td>
              <td className="px-5 py-3">Motivo</td>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-muted-foreground">
            {paginatedItems.map((entry, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 + index * 0.03 }}
                className="group transition-colors hover:bg-accent/20 even:bg-accent/10 text-center"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <td className="text-muted-foreground px-5 py-3.5 font-mono">
                  {formatDate(entry.date, true)}
                </td>
                <td className="text-sm font-medium px-5 py-3.5">
                  {entry.item.nome}
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-center">
                    <Badge
                      variant="outline"
                      className={cn(
                        "font-medium p-3",
                        typeConfig[entry.type]?.className,
                      )}
                    >
                      {typeConfig[entry.type]?.label ?? entry.type}
                    </Badge>
                  </div>
                </td>
                <td className="font-semibold px-5 py-3.5">
                  {entry.quantidade}
                </td>
                <td className="text-muted-foreground px-5 py-3.5">
                  {entry.utilizador.nome}
                </td>
                <td className="text-primary/80 px-5 py-2">
                  {entry.reason ?? (
                    <span className="text-muted-foreground">Sem motivo</span>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {!data?.length && (
          <div className="w-full flex-1 flex flex-col items-center justify-center">
            <BookSearch className="w-20 h-20 text-primary" />
            <h3 className="text-lg">Todas as movimentações aparecerão aqui</h3>
          </div>
        )}
        {data?.length > 0 && !filteredData?.length && (
          <div className="w-full flex-1 flex flex-col items-center justify-center">
            <SearchX className="w-20 h-20 text-destructive" />
            <h3 className="text-lg text-muted-foreground">
              Nenhum item encontrado
            </h3>
          </div>
        )}
      </div>
      <div className="h-fit flex items-center justify-between px-4 py-3 border-t border-border">
        <p className="text-sm text-muted-foreground">
          Mostrando {filteredData?.length > 0 ? startIndex + 1 : startIndex}-
          {Math.min(startIndex + itemsPerPage, filteredData?.length)} de{" "}
          {filteredData?.length} {filteredData?.length === 1 ? "item" : "itens"}
        </p>
        <div className="flex items-center gap-2 min-w-45 justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          {paginationItems.map((item, index) => {
            if (item === "start-ellipsis" || item === "end-ellipsis") {
              return (
                <span
                  key={item + index}
                  className="px-2 text-muted-foreground animate-fade-in"
                >
                  ...
                </span>
              );
            }

            return (
              <Button
                key={item}
                variant={currentPage === item ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(item)}
                className={cn(
                  "w-9 transition-all duration-200",
                  "animate-in fade-in zoom-in-95",
                )}
              >
                {item}
              </Button>
            );
          })}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
