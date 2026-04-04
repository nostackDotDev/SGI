import { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  SearchX,
  BookSearch,
} from "lucide-react";
import { cn } from "@/lib/utils";

const statusConfig = {
  disponivel: {
    label: "Disponível",
    className: "bg-success/10 text-success border-success/20",
  },
  emprestado: {
    label: "Emprestado",
    className: "bg-warning/10 text-warning border-warning/20",
  },
  manutencao: {
    label: "Manutenção",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
};

export function InventoryTable({
  mockItems,
  onViewItem,
  onEditItem,
  onDeleteItem,
  pageSize,
  filter,
}) {
  const [selectedItems, setSelectedItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = pageSize ?? 20;
  const [filteredData, setFilteredData] = useState([]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = useMemo(() => {
    if (!filteredData?.length) return [];

    return filteredData?.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, itemsPerPage, startIndex]);

  const totalPages = Math.ceil(filteredData?.length / itemsPerPage);

  const toggleSelectAll = () => {
    if (selectedItems.length === filteredData?.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredData.map((item) => item.id));
    }
  };

  const toggleSelectItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

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

  const filters = useMemo(() => {
    return [
      (entry) =>
        entry.name
          .toLowerCase()
          .includes(filter.searchTerm.toLowerCase().trim()) ||
        entry.serialNumber
          .toLowerCase()
          .includes(filter.searchTerm.toLowerCase().trim()),
      (entry) =>
        filter.category === "all"
          ? entry
          : entry.category.value === filter.category,
      (entry) =>
        filter.status === "all" ? entry : entry.status === filter.status,
      (entry) =>
        filter.location === "all"
          ? entry
          : entry.location.value === filter.location,
    ];
  }, [filter]);

  useEffect(() => {
    // const data = mockItems.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    const f = () => setFilteredData(mockItems);
    f();
  }, [mockItems]);

  useEffect(() => {
    const r = () => {
      if (!mockItems?.length) {
        setFilteredData([]);
        return;
      }

      const data = mockItems.filter((i) => filters.every((f) => f(i)));

      setCurrentPage(1);
      setFilteredData(data);
    };
    r();
  }, [filters, mockItems]);

  return (
    <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden grid grid-rows-[1fr_auto]">
      <div className="overflow-auto relative no-scrollbar flex flex-col">
        <table className="w-full min-w-3xl table-fixed text-sm">
          <colgroup>
            <col className="w-16" />
            <col className="w-auto" />
            <col className="w-auto" />
            <col className="w-30" />
            <col className="w-auto" />
            {/* <col className="w-21" /> */}
            <col className="w-32" />
          </colgroup>
          <thead className="sticky top-0 z-10 text-lg bg-card">
            <tr className="bg-secondary/50">
              <td>
                <Checkbox
                  className="mx-auto cursor-pointer"
                  checked={
                    selectedItems?.length === mockItems?.length &&
                    mockItems?.length > 0
                  }
                  onCheckedChange={toggleSelectAll}
                />
              </td>
              <td className="py-2 font-semibold">Nome</td>
              <td className="py-2 font-semibold truncate">Categoria</td>
              <td className="py-2 font-semibold text-center">Status</td>
              <td className="py-2 font-semibold truncate text-center">
                Localização
              </td>
              {/* <td className="py-2 font-semibold text-right">Qtd.</td> */}
              <td className="py-2 font-semibold text-center">Ações</td>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedItems.map((item, index) => (
              <tr
                key={index}
                className={cn(
                  "animate-fade-in transition-colors hover:bg-accent/20 even:bg-accent/10",
                  selectedItems.includes(item.id) && "bg-accent/30",
                )}
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <td className="py-2">
                  <Checkbox
                    className="mx-auto cursor-pointer"
                    checked={selectedItems.includes(item.id)}
                    onCheckedChange={() => toggleSelectItem(item.id)}
                  />
                </td>
                <td className="py-2">
                  <div>
                    <p className="font-medium truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.serialNumber}
                    </p>
                  </div>
                </td>
                <td className="py-2 text-muted-foreground">
                  {item.category.label}
                </td>
                <td className="py-2 text-center">
                  <Badge
                    variant="outline"
                    className={cn(
                      "font-medium",
                      statusConfig[item.status].className,
                    )}
                  >
                    {statusConfig[item.status].label}
                  </Badge>
                </td>
                <td className="py-2 text-muted-foreground text-center">
                  {item.location.label}
                </td>
                {/* <td className="py-2 text-right font-medium">{item.quantity}</td> */}
                <td className="py-2 pl-2 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        console.log("View pressed");
                        onViewItem?.(item);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onEditItem?.(item)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => onDeleteItem?.(item)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!mockItems?.length && (
          <div className="w-full flex-1 flex flex-col items-center justify-center">
            <BookSearch className="w-20 h-20 text-primary" />
            <h3 className="text-lg">
              Os itens do seu inventário aparecerão aqui.
            </h3>
            <p className="text-sm text-muted-foreground">
              Comece adicionando um novo item!
            </p>
          </div>
        )}
        {mockItems?.length > 0 && !filteredData?.length && (
          <div className="w-full flex-1 flex flex-col items-center justify-center">
            <SearchX className="w-20 h-20 text-destructive" />
            <h3 className="text-lg text-muted-foreground">
              Nenhum item encontrado
            </h3>
          </div>
        )}
      </div>

      {/* Pagination */}
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
    </div>
  );
}
