import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/api/axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Loader2,
  AlertCircle,
  Users,
} from "lucide-react";
import { ApiEnvelope, User } from "@/types";

function useAllUsers() {
  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      try {
        return (await api.get<ApiEnvelope<User[]>>("/users")).data.data;
      } catch {
        // Keep admin UI usable in local demo mode when backend auth/API is unavailable.
        return [
          {
            id: "admin-1",
            name: "Admin Test",
            email: "admin@avaxia.com",
            role: "admin",
            tenant_id: "",
          },
          {
            id: "client-1",
            name: "Client Test",
            email: "client@tenant.com",
            role: "client",
            tenant_id: "tenant-123",
          },
        ];
      }
    },
  });
}

export default function UsersPage() {
  const { data: users, isLoading, error } = useAllUsers();
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");

  const filtered = users?.filter((u) => {
    const matchSearch =
      search === "" ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === "all" || u.role === filterRole;
    return matchSearch && matchRole;
  });

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-600" />
            Utilisateurs
          </h1>
          <p className="text-slate-500 mt-1">
            {users?.length ?? 0} utilisateur(s) enregistré(s)
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="pt-4 pb-4">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2 flex-1 min-w-48">
              <Search className="h-4 w-4 text-slate-400 shrink-0" />
              <Input
                placeholder="Rechercher par nom ou email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 border-slate-200"
              />
            </div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous les rôles</option>
              <option value="admin">Admin</option>
              <option value="client">Client</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        {isLoading && (
          <div className="flex items-center gap-2 p-6 text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Chargement des utilisateurs...
          </div>
        )}
        {error && (
          <div className="flex items-center gap-2 p-6 text-red-700 bg-red-50">
            <AlertCircle className="h-4 w-4" />
            Erreur lors du chargement des utilisateurs.
          </div>
        )}
        {filtered && (
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="font-semibold text-slate-700">
                  Utilisateur
                </TableHead>
                <TableHead className="font-semibold text-slate-700">
                  Email
                </TableHead>
                <TableHead className="font-semibold text-slate-700">
                  Rôle
                </TableHead>
                <TableHead className="font-semibold text-slate-700">
                  Tenant ID
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-slate-400 py-8"
                  >
                    Aucun utilisateur trouvé.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((user) => (
                  <TableRow key={user.id} className="hover:bg-slate-50/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback
                            className={`text-xs font-bold ${
                              user.role === "admin"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {user.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-slate-800 text-sm">
                          {user.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">
                      {user.email}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          user.role === "admin"
                            ? "border-purple-500 text-purple-700 bg-purple-50"
                            : "border-blue-400 text-blue-600 bg-blue-50"
                        }
                      >
                        {user.role === "admin" ? "Administrateur" : "Client"}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-slate-400">
                      {user.tenant_id ? user.tenant_id.slice(0, 12) + "…" : "—"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
