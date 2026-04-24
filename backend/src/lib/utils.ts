import { Permission } from "../types/tables";

export function getPermissions(cargo: any): Permission[] {
  if (!Array.isArray(cargo?.permissoes)) return [];
  return cargo.permissoes as Permission[];
}