import { useEffect, useState } from "react";
import { InventoryFilters } from "@/components/inventory/InventoryFilters";
import { CreateItemDialog } from "@/components/inventory/CreateItemDialog";
import { ItemDetailDialog } from "@/components/inventory/ItemDetailDialog";
import { InventoryTable } from "@/components/inventory/InventoryTable";
import PageContainer from "@/components/layout/PageContainer";
import { refreshManager, request } from "@/lib/request";
import { EditItemDialog } from "@/components/inventory/EditItemDialog";
import DeleteDialog from "@/components/common/DeleteDialog";
import Loader from "@/components/layout/Loader";

export default function Inventory() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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
  const [items, setItems] = useState(null);
  const [reason, setReason] = useState("");

  const fetchItems = () => {
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
  };

  const deleteItem = (id) => {
    if (!reason.trim()) {
      console.warn("Deletion reason is required");
      return;
    }

    request(
      `/item/${id}`,
      "DELETE",
      {
        data: {
          reason,
        },
      },
      () => {
        fetchItems();
      },
      (err) => {
        console.error(err);
      },
    );
  };

  useEffect(() => {
    const refreshItems = () => {
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
    };

    refreshManager.register("items", refreshItems);
    refreshItems();

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

    fetchItems();
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
      {items ? (
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
          onDeleteItem={(item) => {
            setSelectedItem(item);
            setDeleteDialogOpen(true);
          }}
        />
      ) : (
        <Loader />
      )}

      {/* Modais */}
      <CreateItemDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        categorias={categories}
        status={statusOptions}
        localizacoes={locations}
        onSuccess={fetchItems}
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
      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        withReason={true}
        reason={reason}
        setReason={setReason}
        onConfirm={() => {
          if (selectedItem) {
            deleteItem(selectedItem.id);
          }
        }}
        title={`Eliminar ${selectedItem?.nome || "item"}?`}
        description="Tem certeza de que deseja eliminar este item? Esta ação não pode ser desfeita."
      />
    </PageContainer>
  );
}
