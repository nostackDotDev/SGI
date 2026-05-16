import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Package,
  MapPin,
  Hash,
  Layers,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  RefreshCw,
} from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { useEffect, useState } from "react";
import { request } from "@/lib/request";

const statusConfig = {
  1: {
    className: "bg-success/10 text-success border-success/20",
  },
  2: {
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
  3: {
    className: "bg-warning/10 text-warning border-warning/20",
  },
};

const mockHistory = [
  {
    type: "check-out",
    user: "João Silva",
    date: "15/12/2024",
    notes: "Uso em apresentação",
  },
  {
    type: "check-in",
    user: "Maria Santos",
    date: "10/12/2024",
    notes: "Devolvido em bom estado",
  },
  {
    type: "check-out",
    user: "Maria Santos",
    date: "05/12/2024",
    notes: "Projeto X",
  },
  { type: "check-in", user: "Pedro Costa", date: "01/12/2024", notes: "" },
];

export function ItemDetailDialog({
  open,
  onOpenChange,
  item,
  onRegisterDeletion,
  onRegisterCheckout,
  onRegisterReturn,
  onRegisterRestore,
}) {
  const [itemHistory, setItemHistory] = useState([]);

  const fetchItemHistory = () => {
    request(
      `/registo/item/${item?.id}`,
      "GET",
      {},
      (data) => setItemHistory(data.data || []),
      (err) => {
        console.error(err);
        setItemHistory(itemHistory ?? []);
      },
    );
  };
  useEffect(() => {
    const f = () => {
      if (!item) {
        setItemHistory([]);
        return;
      }

      fetchItemHistory();
    };
    f();
  }, [item]);

  const typeConfig = {
    in: {
      label: "Entrada",
    },
    transfer: {
      label: "Transferência",
    },
    out: {
      label: "Saída",
    },
    return: {
      label: "Devolução",
    },
    restore: {
      label: "Restauração",
    },
    exit: {
      label: "Saída",
    },
  };

  const inMoves = ["in", "return", "restore"];

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-150">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl">{item.name}</DialogTitle>
              <Badge
                variant="outline"
                className={cn(
                  "mt-2 font-medium",
                  statusConfig[item.status.value]?.className,
                )}
              >
                {item.status.label}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Item Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
              <Package className="w-5 h-5" />
              <div>
                <p className="text-xs">Categoria</p>
                <p className="font-medium">{item.category.label}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
              <MapPin className="w-5 h-5" />
              <div>
                <p className="text-xs">Localização</p>
                <p className="font-medium">{item.location.label}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
              <Hash className="w-5 h-5" />
              <div>
                <p className="text-xs">Nº de Série</p>
                <p className="font-medium">{item.serialNumber}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
              <Layers className="w-5 h-5" />
              <div>
                <p className="text-xs">Quantidade</p>
                <p className="font-medium">{item.quantity} unidades</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* History */}
          <div>
            <h4 className="font-semibold mb-4">Histórico de Movimentações</h4>
            <div className="space-y-3 min-h-20 max-h-50 overflow-y-auto pr-2">
              {itemHistory ? (
                itemHistory.length > 0 ? (
                  itemHistory.map((entry, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                          inMoves.includes(entry.type)
                            ? "bg-success/10 text-success"
                            : "bg-warning/10 text-warning",
                        )}
                      >
                        {!inMoves.includes(entry.type) ? (
                          <ArrowDownLeft className="w-4 h-4" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-medium text-sm">
                            {entry.utilizador.nome}
                          </p>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3 -mt-1" />
                            {formatDate(entry.date, true)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {typeConfig[entry.type]?.label ?? entry.type}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Nenhuma movimentação registrada.
                  </p>
                )
              ) : (
                <p className="text-sm text-muted-foreground">
                  Não foi possível carregar o histórico.
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {item.status.value === 1 ? (
              <Button className="flex-1" onClick={onRegisterCheckout}>
                <ArrowUpRight className="w-4 h-4 mr-2" />
                Registrar Saída
              </Button>
            ) : item.status.value === 3 ? (
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => {
                  onOpenChange(false);
                  onRegisterReturn();
                }}
              >
                <ArrowDownLeft className="w-4 h-4 mr-2" />
                Registrar Devolução
              </Button>
            ) : (
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => {
                  onOpenChange(false);
                  onRegisterRestore();
                }}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Registrar Restauração
              </Button>
            )}
            <Button
              variant="destructive"
              onClick={() => {
                onOpenChange(false);
                onRegisterDeletion();
              }}
              className="flex-1"
            >
              Registrar Remoção
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
