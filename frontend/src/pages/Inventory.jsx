import { useEffect, useState } from "react";
import { InventoryFilters } from "@/components/inventory/InventoryFilters";
import { CreateItemDialog } from "@/components/inventory/CreateItemDialog";
import { BulkImportDialog } from "@/components/inventory/BulkImportDialog";
import { ItemDetailDialog } from "@/components/inventory/ItemDetailDialog";
import { InventoryTable } from "@/components/inventory/InventoryTable";
import PageContainer from "@/components/layout/PageContainer";
import { refreshManager, request } from "@/lib/request";
import { EditItemDialog } from "@/components/inventory/EditItemDialog";
import DeleteDialog from "@/components/common/DeleteDialog";
import Loader from "@/components/layout/Loader";
import { RegisterReturnDialog } from "@/components/inventory/RegisterReturnDialog";
import { RegisterRemovalDialog } from "@/components/inventory/RegisterRemovalDialog";
import { RegisterRestoreDialog } from "@/components/inventory/RegisterRestoreDialog";
import { RegisterStatusChangeDialog } from "@/components/inventory/RegisterStatusChangeDialog";

export default function Inventory() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [bulkImportOpen, setBulkImportOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [registerReturnOpen, setRegisterReturnOpen] = useState(false);
  const [registerExitOpen, setRegisterExitOpen] = useState(false);
  const [registerRestoreOpen, setRegisterRestoreOpen] = useState(false);
  const [registerStatusChangeOpen, setRegisterStatusChangeOpen] =
    useState(false);

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

  const refreshItems = () => {
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
        refreshItems();
      },
      (err) => {
        console.error(err);
      },
    );
  };

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

    return () => {
      refreshManager.unregister("items", refreshItems);
    };
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
        onBulkImport={() => setBulkImportOpen(true)}
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
        onSuccess={refreshItems}
      />
      <BulkImportDialog
        open={bulkImportOpen}
        onOpenChange={setBulkImportOpen}
        categorias={categories}
        status={statusOptions}
        localizacoes={locations}
        onSuccess={refreshItems}
      />
      <EditItemDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        item={selectedItem}
        setSelectedItem={setSelectedItem}
        categorias={categories}
        status={statusOptions}
        localizacoes={locations}
        onSuccess={refreshItems}
      />
      <ItemDetailDialog
        key={selectedItem?.id ?? undefined}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        item={selectedItem}
        onRegisterReturn={() => setRegisterReturnOpen(true)}
        onRegisterRestore={() => setRegisterRestoreOpen(true)}
        onRegisterStatusChange={() => setRegisterStatusChangeOpen(true)}
        onRegisterDeletion={() => setRegisterExitOpen(true)}
      />
      <RegisterReturnDialog
        open={registerReturnOpen}
        onOpenChange={setRegisterReturnOpen}
        item={selectedItem}
        localizacoes={locations}
        onSuccess={refreshItems}
      />
      <RegisterRestoreDialog
        open={registerRestoreOpen}
        onOpenChange={setRegisterRestoreOpen}
        item={selectedItem}
        localizacoes={locations}
        onSuccess={refreshItems}
      />
      <RegisterStatusChangeDialog
        open={registerStatusChangeOpen}
        onOpenChange={setRegisterStatusChangeOpen}
        localizacoes={locations}
        item={selectedItem}
        onSuccess={refreshItems}
      />
      <RegisterRemovalDialog
        open={registerExitOpen}
        onOpenChange={setRegisterExitOpen}
        item={selectedItem}
        onSuccess={refreshItems}
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
