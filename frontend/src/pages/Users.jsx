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
import { refreshManager, request } from "@/lib/request";
import {
  Mail,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Settings2,
  Shield,
} from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PERMISSIONS } from "@/core/constants/permissions";
import { PermissionDisabled } from "@/components/auth/PermissionDisabled";

export default function Users() {
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");

  const [users, setUsers] = useState([]);
  const [cargos, setCargos] = useState([]);

  const [addUserOpen, setAddUserOpen] = useState(false);

  const refreshUsers = () =>
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

  const refreshCargos = () =>
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

  useEffect(() => {
    refreshManager.register("utlizadores", refreshUsers);
    refreshManager.register("cargos", refreshCargos);

    refreshUsers();
    refreshCargos();

    return () => {
      refreshManager.unregister("utlizadores", refreshUsers);
      refreshManager.unregister("cargos", refreshCargos);
    };
  }, []);

  const roleBadgeColors = [
    "bg-primary/15 text-primary",
    "bg-cyan-accent/15 text-cyan-accent",
    "bg-purple-accent/15 text-purple-accent",
    "bg-success/15 text-success",
  ];

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLevel =
      levelFilter === "all" || String(user.cargoId) === levelFilter;

    return matchesSearch && matchesLevel;
  });

  return (
    <PageContainer className="grid grid-rows-[auto_1fr] gap-6 ">
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
              {cargos.length > 0 &&
                cargos.map((d, i) => (
                  <SelectItem key={i} value={String(d.id)}>
                    {d.nome}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <PermissionDisabled permission={PERMISSIONS.USER_CREATE}>
            <Button
              className="w-full py-5 sm:w-auto"
              onClick={() => setAddUserOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Utilizador
            </Button>
          </PermissionDisabled>
        </div>

        {/* Users Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {filteredUsers.map((user, i) => {
            const initials = user.nome
              ? user.nome
                  .split(" ")
                  .map((item) => item[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()
              : "US";

            return (
              <motion.div
                key={user.email}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className="glass-card rounded-xl p-5 hover:glow-sm transition-shadow"
              >
                {/* <div className="flex items-start justify-between"> */}
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="#" />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {user.nome}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                  {/* </div> */}
                  {/* <button className="rounded-md p-1 text-muted-foreground/50 hover:text-foreground transition-colors">
                    <MoreHorizontal className="h-4 w-4" />
                  </button> */}
                </div>

                <div className="mt-4 flex items-center justify-between gap-2 text-sm">
                  <Badge
                    variant="default"
                    className={`flex items-center gap-1 rounded-full px-2.5 py-3.5 font-medium ${roleBadgeColors[i] || "bg-muted text-muted-foreground"}`}
                  >
                    <Shield className="h-3 w-3" />
                    {user.cargo}
                  </Badge>
                  <span className="text-muted-foreground/50 font-mono">
                    {formatDate(user.createdAt, true)}
                  </span>
                </div>

                <div className="mt-4 flex gap-2">
                  <button className="glass flex-1 rounded-lg px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer flex items-center justify-center gap-1.5">
                    <Settings2 className="w-4 h-4" />
                    Permissões
                  </button>
                  <button className="glass flex-1 rounded-lg px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer flex items-center justify-center gap-1.5">
                    <Pencil className="w-4 h-4" />
                    Editar
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <CreateUserDialog
        open={addUserOpen}
        onOpenChange={setAddUserOpen}
        cargos={cargos}
      />
    </PageContainer>
  );
}
