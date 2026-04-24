export function getPermissions(cargo) {
  if (!Array.isArray(cargo?.permissoes)) return [];
  return cargo.permissoes;
}