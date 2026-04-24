import PageContainer from "@/components/layout/PageContainer";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import UsersTable from "@/components/users/usersTable.jsx";
import { Search } from "lucide-react";

import { useState } from "react";

const utilizadores = [
  {
    id: 1,
    name: "Edward Perry",
    level: "admin",
    permissions: ["Full Access", "User Management", "System Settings"],
    createdAt: "07-16-2025",
  },
  {
    id: 2,
    name: "Josephine Drake",
    level: "user",
    createdAt: "07-16-2025",
    permissions: ["View Articles", "Create Articles"],
  },
  {
    id: 3,
    name: "Cody Phillips",
    level: "user",
    createdAt: "7-16-2025",
    permissions: ["View Articles"],
  },
];

export default function Users() {
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");

  return (
    <PageContainer className="grid grid-rows-[auto_1fr] gap-6">
      <div>
        <h1 className="text-2xl font-bold">Utilizadores</h1>
        <p className="text-muted-foreground mt-1">
          Gerir e visualizar quem tem acesso ao sistema, suas permissões e
          atividades recentes.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Filters */}
        <div className="card-elevated flex flex-col sm:flex-row gap-4 p-5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar por artigo ou utilizador..."
              className="pl-9 h-11"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-full sm:w-45 py-5">
              <SelectValue placeholder="Todos os tipos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="admin">Administrador</SelectItem>
              <SelectItem value="user">Usuário padrão</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <UsersTable
          data={utilizadores}
          levelFilter={levelFilter}
          pageSize={20}
          filter={{
            searchTerm: searchTerm,
            level: levelFilter,
          }}
        />
      </div>
    </PageContainer>
  );
}
