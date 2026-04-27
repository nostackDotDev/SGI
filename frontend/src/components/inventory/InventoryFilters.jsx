import { Search, Plus, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "../ui/label";

export function InventoryFilters({
  onAddItem,
  searchTerm,
  setSearchTerm,
  category,
  setCategory,
  status,
  setStatus,
  location,
  setLocation,
  categorias,
  estados,
  localizacoes,
}) {
  const debounceSetSearch = (value) => {
    const t = setTimeout(() => {
      setSearchTerm(value);
    }, 50);

    return () => clearTimeout(t);
  };

  return (
    <div className="w-full flex flex-col sm:flex-row gap-4 items-start sm:items-end justify-between card-elevated p-6 px-4">
      <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full sm:w-full">
        {/* Pesquisa */}
        <div className="grid gap-2">
          <Label htmlFor="searchFilter" className="px-2">
            Pesquisa
          </Label>
          <div className="relative flex-1 sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="searchFilter"
              placeholder="Buscar itens..."
              className="pl-9 bg-card"
              value={searchTerm}
              onChange={(v) => debounceSetSearch(v.currentTarget.value)}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <div className="grid gap-2">
            <Label htmlFor="categoryFilter" className="px-2">
              Categoria
            </Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="categoryFilter" className="w-35 bg-card">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {categorias.length > 0 &&
                  categorias.map((c, i) => (
                    <SelectItem key={i} value={String(c.id)}>
                      {c.nome}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="statusFilter" className="px-2">
              Status
            </Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="statusFilter" className="w-35 bg-card">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {estados.length > 0 &&
                  estados.map((c, i) => (
                    <SelectItem key={i} value={String(c.nome)}>
                      {c.nome}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="locationFilter" className="px-2">
              Localização
            </Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger id="locationFilter" className="w-35 bg-card">
                <SelectValue placeholder="Local" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {localizacoes.length > 0 &&
                  localizacoes.map((c, i) => (
                    <SelectItem key={i} value={String(c.id)}>
                      {c.nome}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Add Button */}
      <Button onClick={onAddItem} className="w-full py-5 sm:w-auto">
        <Plus className="w-4 h-4 mr-2" />
        Novo Item
      </Button>
    </div>
  );
}
