import { cn, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Eye,
  Pencil,
  Search,
  SearchX,
  Trash2,
  UserCircleIcon,
  UserRoundX,
} from "lucide-react";
import { Button } from "../ui/button";
import React, { useEffect, useMemo, useState } from "react";
import { Collapsible, CollapsibleContent } from "../ui/collapsible";
import { groupPermissionsByFeature } from "@/lib/authContext";

export default function UsersTable({
  data,
  levelFilter,
  pageSize,
  filter,
  cargos,
}) {
  const [expandedRow, setExpandedRow] = useState(null);

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
    const matchesSearch = u.nome
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
        entry.nome
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
            <col className="w-50" />
            <col className="w-auto" />
            <col className="w-40" />
            <col className="w-auto" />
            <col className="w-50" />
            <col className="w-28" />
          </colgroup>
          <thead className="sticky top-0 z-10 text-lg bg-card font-semibold text-center">
            <tr className="bg-secondary/50 capitalize">
              <td className="py-2 px-4 text-center">Última atualização</td>
              <td className="py-2 text-left">Nome</td>
              <td className="py-2">Cargo</td>
              <td className="py-2">Endereço de e-mail</td>
              <td className="py-2">Permissões</td>
              <td className="py-2">Ações</td>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedItems.map((item, index) => {
              const isOpen = expandedRow === index;

              return (
                <React.Fragment key={index}>
                  {/* MAIN ROW */}
                  <tr
                    key={`collapsible-header-${index}`}
                    className="animate-fade-in text-center hover:bg-accent/20 even:bg-accent/10"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <td className="text-center text-muted-foreground py-3 px-4">
                      {formatDate(item.updatedAt)}
                    </td>

                    <td className="text-left py-3">{item.nome}</td>

                    <td className="py-3">
                      <Badge
                        variant="outline"
                        className={cn("font-medium p-3")}
                      >
                        {item.cargo}
                      </Badge>
                    </td>

                    <td className="text-muted-foreground py-3">{item.email}</td>

                    {/* CLICKABLE PERMISSIONS */}
                    <td
                      className="font-semibold py-3 cursor-pointer hover:text-primary"
                      onClick={() => setExpandedRow(isOpen ? null : index)}
                    >
                      <div className="flex items-center justify-center gap-2">
                        Ver permissões
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </td>

                    <td className="py-2 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Pencil className="w-4 h-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>

                  {/* COLLAPSIBLE ROW */}
                  <tr
                    key={`collapsible-content-${index}`}
                    className="bg-accent/10"
                  >
                    <td colSpan={6} className="p-0 border-none">
                      <Collapsible open={isOpen}>
                        <CollapsibleContent className="px-4 py-3 overflow-hidden flex items-center justify-center gap-2">
                          {cargos[index]?.permissoes?.length ? (
                            groupPermissionsByFeature(
                              cargos[index].permissoes,
                            ).map((group, i) => (
                              <div key={i} className="flex gap-1">
                                <span className="font-bold text-sm text-primary">
                                  {group.displayFeature}:
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  {group.accessLevel}
                                  {i === cargos[index].permissoes?.length - 1
                                    ? ""
                                    : ","}{" "}
                                </span>
                              </div>
                            ))
                          ) : (
                            <span className="text-center text-muted-foreground mx-auto block">
                              Nenhuma permissão atribuída a este cargo
                            </span>
                          )}
                        </CollapsibleContent>
                      </Collapsible>
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
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
