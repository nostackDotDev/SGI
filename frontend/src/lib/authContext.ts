import { PERMISSION_LABELS } from "@/core/constants/permissions";

export const getPermissionLabel = (permission: string) =>
  PERMISSION_LABELS[permission] ?? permission;

export const mapPermissionLabels = (permissions: string[]) =>
  permissions.map((permission) => ({
    key: permission,
    label: getPermissionLabel(permission),
  }));

export const checkPermission = (
  permissions: string[] | undefined,
  permission: string,
) => Array.isArray(permissions) && permissions.includes(permission);

export const groupPermissionsByFeature = (permissions: string[]) => {
  const grouped = new Map<
    string,
    { read: boolean; create: boolean; update: boolean; delete: boolean }
  >();

  // Group permissions by feature
  permissions.forEach((permission) => {
    const [feature, action] = permission.split("_");
    if (!grouped.has(feature)) {
      grouped.set(feature, {
        read: false,
        create: false,
        update: false,
        delete: false,
      });
    }
    const actions = grouped.get(feature)!;
    if (action === "READ") actions.read = true;
    if (action === "CREATE") actions.create = true;
    if (action === "UPDATE") actions.update = true;
    if (action === "DELETE") actions.delete = true;
  });

  const FEATURE_LABELS: Record<string, string> = {
    ITEM: "Itens",
    USER: "Utilizadores",
    CARGO: "Cargos",
    CATEGORIA: "Categorias",
    SALA: "Salas",
    DEPARTAMENTO: "Departamentos",
    INSTITUICAO: "Instituição",
    CONDICAO: "Condição",
    REGISTO: "Registos",
  };

  // Determine access level for each feature
  const result = Array.from(grouped.entries()).map(([feature, actions]) => {
    let accessLevel = "";
    let displayFeature =
      FEATURE_LABELS[feature] ??
      feature.charAt(0) + feature.slice(1).toLowerCase();

    if (actions.read && actions.create && actions.update && actions.delete) {
      accessLevel = `Controle total`;
    } else if (actions.read && actions.create && actions.update) {
      accessLevel = `Pode ler e gerir`;
    } else if (
      actions.delete &&
      !actions.read &&
      !actions.create &&
      !actions.update
    ) {
      accessLevel = `Pode eliminar`;
    } else if (
      actions.read &&
      !actions.create &&
      !actions.update &&
      !actions.delete
    ) {
      accessLevel = `Pode ler`;
    } else if (actions.create && !actions.read && !actions.update) {
      accessLevel = `Pode criar`;
    } else if (
      (actions.read || actions.create || actions.update) &&
      !actions.delete
    ) {
      const actions_list = [];
      if (actions.read) actions_list.push("ler");
      if (actions.create) actions_list.push("criar");
      if (actions.update) actions_list.push("atualizar");
      accessLevel = `Pode ${actions_list.join(", ")}`;
    } else {
      const actions_list = [];
      if (actions.read) actions_list.push("ler");
      if (actions.create) actions_list.push("criar");
      if (actions.update) actions_list.push("atualizar");
      if (actions.delete) actions_list.push("eliminar");
      accessLevel = `Pode ${actions_list.join(", ")}`;
    }

    return {
      feature,
      displayFeature,
      accessLevel,
    };
  });

  return result.sort((a, b) => a.feature.localeCompare(b.feature));
};
