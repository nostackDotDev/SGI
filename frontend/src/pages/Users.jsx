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
import { CreateUserDialog } from "@/components/users/CreateUserDialog";
import UsersTable from "@/components/users/UsersTable.jsx";
import { request } from "@/lib/request";
import { Plus, Search } from "lucide-react";

import { useEffect, useState } from "react";

export default function Users() {
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");

  const [users, setUsers] = useState([]);
  const [cargos, setCargos] = useState([]);

  const [addUserOpen, setAddUserOpen] = useState(false);

  useEffect(() => {
    request(
      "/utilizador",
      "GET",
      {},
      (data) => setUsers(data.data || []),
      (err) => {
        setUsers([]);
        console.error(err);
      },
    );
    request(
      "/cargo",
      "GET",
      {},
      (data) => setCargos(data.data || []),
      (err) => {
        setCargos([]);
        console.error(err);
      },
    );
  }, []);

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
          <Button
            className="w-full py-5 sm:w-auto"
            onClick={() => setAddUserOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Utilizador
          </Button>
        </div>

        {/* Table */}
        <UsersTable
          data={users}
          levelFilter={levelFilter}
          pageSize={20}
          filter={{
            searchTerm: searchTerm,
            level: levelFilter,
          }}
          cargos={cargos}
        />
      </div>

      <CreateUserDialog
        open={addUserOpen}
        onOpenChange={setAddUserOpen}
        cargos={cargos}
      />
    </PageContainer>
  );
}
