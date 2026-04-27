import { useEffect, useState } from "react";
import { InventoryFilters } from "@/components/inventory/InventoryFilters";
import { CreateItemDialog } from "@/components/inventory/CreateItemDialog";
import { ItemDetailDialog } from "@/components/inventory/ItemDetailDialog";
import { InventoryTable } from "@/components/inventory/InventoryTable";
import PageContainer from "@/components/layout/PageContainer";
import { request } from "@/lib/request";
import { EditItemDialog } from "@/components/inventory/EditItemDialog";

export default function Inventory() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [location, setLocation] = useState("all");

  const [categories, setCategories] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [locations, setLocations] = useState([]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    request(
      "/categoria",
      "GET",
      {},
      (data) => setCategories(data.data || []),
      (err) => {
        setCategories([]);
        console.error(err);
      },
    );
    request(
      "/condicao",
      "GET",
      {},
      (data) => setStatusOptions(data.data || []),
      (err) => {
        setStatusOptions([]);
        console.error(err);
      },
    );
    request(
      "/localizacao",
      "GET",
      {},
      (data) => setLocations(data.data || []),
      (err) => {
        setLocations([]);
        console.error(err);
      },
    );

    request(
      "/item",
      "GET",
      {},
      (data) => setItems(data.data || []),
      (err) => {
        setItems([]);
        console.error(err);
      },
    );
  }, []);

  return (
    <PageContainer className="grid grid-rows-[auto_auto_1fr] gap-6">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-2xl font-bold">Inventário</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie todos os itens do seu estoque
        </p>
      </div>

      {/* Filtros */}
      <InventoryFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        category={category}
        setCategory={setCategory}
        status={status}
        setStatus={setStatus}
        location={location}
        setLocation={setLocation}
        onAddItem={() => setAddDialogOpen(true)}
        setPageSize={setPageSize}
        categorias={categories}
        estados={statusOptions}
        localizacoes={locations}
      />

      {/* Tabela */}
      <InventoryTable
        mockItems={items}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pageSize={pageSize}
        filter={{
          searchTerm: searchTerm,
          category: category,
          status: status,
          location: location,
        }}
        onViewItem={(item) => {
          setSelectedItem(item);
          setDetailDialogOpen(true);
        }}
        onEditItem={(item) => {
          setSelectedItem(item);
          setEditDialogOpen(true);
        }}
      />

      {/* Modais */}
      <CreateItemDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        categorias={categories}
        status={statusOptions}
        localizacoes={locations}
      />
      <EditItemDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        item={selectedItem}
        setSelectedItem={setSelectedItem}
        categorias={categories}
        status={statusOptions}
        localizacoes={locations}
      />
      <ItemDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        item={selectedItem}
        onEdit={() => {
          setDetailDialogOpen(false);
          setEditDialogOpen(true);
        }}
      />
    </PageContainer>
  );
}
