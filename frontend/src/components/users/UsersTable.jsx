import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Search,
  SearchX,
  Trash2,
  UserCircleIcon,
  UserRoundX,
} from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useMemo, useState } from "react";

const levelConfig = {
  admin: {
    label: "Administrador",
    className: "bg-primary/10 text-primary border-primary/20",
  },
  user: {
    label: "Usuário padrão",
    className: "bg-sidebar-accent border-destructive/20",
  },
};

export default function UsersTable({ data, levelFilter, pageSize, filter }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = pageSize ?? 20;
  const [filteredData, setFilteredData] = useState([]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = useMemo(() => {
    if (!filteredData?.length) return [];

    return filteredData?.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, itemsPerPage, startIndex]);

  const totalPages = Math.ceil(filteredData?.length / itemsPerPage);

  const filtered = data.filter((u) => {
    const matchesSearch = u.name
      .toLowerCase()
      .includes(filter.searchTerm.toLowerCase().trim());
    const matchesType =
      levelFilter === "all" ||
      u.level === (levelFilter === "admin" ? "admin" : "user");
    return matchesSearch && matchesType;
  });

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
          .includes(filter.searchTerm.toLowerCase().trim()),
      (entry) =>
        filter.level === "all" ? entry : entry.level === filter.level,
    ];
  }, [filter]);

  useEffect(() => {
    const f = () => setFilteredData(data);
    f();
  }, [data]);

  useEffect(() => {
    const r = () => {
      if (!data?.length) {
        setFilteredData([]);
        return;
      }

      const newData = data.filter((i) => filters.every((f) => f(i)));

      setCurrentPage(1);
      setFilteredData(newData);
    };
    r();
  }, [filters, data]);

  return (
    <div className="w-full h-full flex-1 overflow-hidden flex flex-col bg-card rounded-xl border border-border ">
      <div className="flex-1 min-h-0 overflow-auto relative no-scrollbar flex flex-col">
        <table className="w-full table-fixed min-w-3xl text-sm">
          <colgroup>
            <col className="w-auto" />
            <col className="w-50" />
            <col className="w-auto" />
            <col className="w-auto" />
            <col className="w-28" />
          </colgroup>
          <thead className="sticky top-0 z-10 text-lg bg-card font-semibold text-center">
            <tr className="bg-secondary/50 capitalize">
              <td className="py-2 px-4 text-left">nome</td>
              <td className="py-2">nível de Acesso</td>
              <td className="py-2">Permissões</td>
              <td className="py-2">data de criação</td>
              <td className="py-2">ações</td>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedItems.map((item, index) => (
              <tr
                key={index}
                className="animate-fade-in text-center hover:bg-accent/20 even:bg-accent/10"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <td className="text-left text-muted-foreground py-3 px-4">
                  {item.name}
                </td>
                <td className="py-3">
                  <Badge
                    variant="outline"
                    className={cn(
                      "font-medium p-3",
                      levelConfig[item.level].className,
                    )}
                  >
                    {levelConfig[item.level].label}
                  </Badge>
                </td>
                <td className="font-semibold py-3">
                  {!item.permissions.length
                    ? "Nenhuma permissão"
                    : item.permissions.join(", ")}
                </td>
                <td className="text-muted-foreground py-3">{item.createdAt}</td>
                <td className="py-2 px-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        console.log("View pressed");
                        // onViewItem?.(item);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      //   onClick={() => onEditItem?.(item)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      //   onClick={() => onDeleteItem?.(item)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!data?.length && (
          <div className="w-full flex-1 flex flex-col items-center justify-center">
            <UserCircleIcon className="w-20 h-20 text-primary" />
            <h3 className="text-lg">Todos os utilizadores aparecerão aqui</h3>
          </div>
        )}
        {data?.length > 0 && !filtered?.length && (
          <div className="w-full flex-1 flex flex-col items-center justify-center">
            <SearchX className="w-20 h-20 text-destructive" />
            <h3 className="text-lg text-muted-foreground">
              Nenhum utilizador encontrado
            </h3>
          </div>
        )}
      </div>
      <div className="h-fit flex items-center justify-between px-4 py-3 border-t border-border">
        <p className="text-sm text-muted-foreground">
          Mostrando {filtered?.length > 0 ? startIndex + 1 : startIndex}-
          {Math.min(startIndex + itemsPerPage, filtered?.length)} de{" "}
          {filtered?.length} {filtered?.length === 1 ? "item" : "itens"}
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
