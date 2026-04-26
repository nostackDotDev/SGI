import { useState } from "react";
import { InventoryFilters } from "@/components/inventory/InventoryFilters";
import { CreateItemDialog } from "@/components/inventory/CreateItemDialog";
import { ItemDetailDialog } from "@/components/inventory/ItemDetailDialog";
import { InventoryTable } from "@/components/inventory/InventoryTable";
import PageContainer from "@/components/layout/PageContainer";
// import { EditItemDialog } from "@/components/inventory/EditItemDialog";

const mockItems = [
  {
    id: "1",
    name: "Notebook Dell XPS 15",
    category: {
      value: "eletronicos",
      label: "Eletrônicos",
    },
    status: "disponivel",
    location: {
      value: "sala-101",
      label: "Sala 101",
    },
    quantity: 5,
    serialNumber: "XPS-2024-001",
  },
  {
    id: "2",
    name: 'Monitor LG 27"',
    category: {
      value: "eletronicos",
      label: "Eletrônicos",
    },
    status: "emprestado",
    location: {
      value: "deposito-a",
      label: "Depósito A",
    },
    quantity: 12,
    serialNumber: "LG-2024-015",
  },
  {
    id: "3",
    name: "Teclado Mecânico",
    category: {
      value: "perifericos",
      label: "Periféricos",
    },
    status: "disponivel",
    location: {
      value: "sala-102",
      label: "Sala 102",
    },
    quantity: 25,
    serialNumber: "KB-2024-042",
  },
  {
    id: "4",
    name: "Mouse Wireless",
    category: {
      value: "perifericos",
      label: "Periféricos",
    },
    status: "manutencao",
    location: {
      value: "deposito-b",
      label: "Depósito B",
    },
    quantity: 30,
    serialNumber: "MS-2024-088",
  },
  {
    id: "5",
    name: "Webcam HD",
    category: {
      value: "eletronicos",
      label: "Eletrônicos",
    },
    status: "disponivel",
    location: {
      value: "sala-101",
      label: "Sala 101",
    },
    quantity: 8,
    serialNumber: "WC-2024-023",
  },
  {
    id: "6",
    name: "Headset Profissional",
    category: {
      value: "audio",
      label: "Áudio",
    },
    status: "emprestado",
    location: {
      value: "sala-103",
      label: "Sala 103",
    },
    quantity: 15,
    serialNumber: "HS-2024-056",
  },
  {
    id: "7",
    name: "Cabo HDMI 2m",
    category: {
      value: "cabos",
      label: "Cabos",
    },
    status: "disponivel",
    location: {
      value: "deposito-a",
      label: "Depósito A",
    },
    quantity: 50,
    serialNumber: "CB-2024-112",
  },
  {
    id: "8",
    name: "Adaptador USB-C",
    category: {
      value: "adaptadores",
      label: "Adaptadores",
    },
    status: "disponivel",
    location: {
      value: "deposito-b",
      label: "Depósito B",
    },
    quantity: 40,
    serialNumber: "AD-2024-078",
  },
];

export default function Inventory() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  // const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [location, setLocation] = useState("all");

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
      />

      {/* Tabela */}
      <InventoryTable
        mockItems={mockItems}
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
          // setEditDialogOpen(true);
        }}
      />

      {/* Modais */}
      <CreateItemDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        condicoes={[]}
      />
      {/* <EditItemDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        initialItem={selectedItem}
        setSelectedItem={setSelectedItem}
      /> */}
      <ItemDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        item={selectedItem}
        onEdit={() => {
          setDetailDialogOpen(false);
          // setEditDialogOpen(true);
        }}
      />
    </PageContainer>
  );
}
