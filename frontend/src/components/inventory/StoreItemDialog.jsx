import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";

export function StoreItemDialog({
  open,
  onOpenChange,
  initialItem,
  setSelectedItem,
}) {
  const [item, setItem] = useState(null);
  // const [canSubmit, setCanSubmit] = useState(false)

  useEffect(() => {
    function f() {
      if (!open) {
        setSelectedItem(null);
        return;
      }
      setItem(initialItem);
    }
    f();
  }, [open]);

  const isEditing = !!item;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125 max-h-7/9 overflow-y-auto no-scrollbar">
        <DialogHeader className="">
          <DialogTitle>{isEditing ? "Editar Item" : "Novo Item"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Atualize as informações do item"
              : "Preencha as informações do novo item"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nome do Item</Label>
            <Input
              id="name"
              placeholder="Ex: Notebook Dell XPS 15"
              defaultValue={item?.name}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="category">Categoria</Label>
              <Select defaultValue={item?.category?.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eletronicos">Eletrônicos</SelectItem>
                  <SelectItem value="perifericos">Periféricos</SelectItem>
                  <SelectItem value="audio">Áudio</SelectItem>
                  <SelectItem value="cabos">Cabos</SelectItem>
                  <SelectItem value="adaptadores">Adaptadores</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location">Localização</Label>
              <Select defaultValue={item?.location?.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sala-101">Sala 101</SelectItem>
                  <SelectItem value="sala-102">Sala 102</SelectItem>
                  <SelectItem value="sala-103">Sala 103</SelectItem>
                  <SelectItem value="deposito-a">Depósito A</SelectItem>
                  <SelectItem value="deposito-b">Depósito B</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="serial">Número de Série</Label>
              <Input
                id="serial"
                placeholder="Ex: XPS-2024-001"
                defaultValue={item?.serialNumber}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="quantity">Quantidade</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                placeholder="0"
                defaultValue={item?.quantity}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Descrição detalhada do item..."
              rows={3}
              className="max-h-80"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="reset"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button type="submit" onClick={() => onOpenChange(false)}>
            {isEditing ? "Salvar Alterações" : "Adicionar Item"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
