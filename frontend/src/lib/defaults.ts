/**
 * Utility functions for working with default items (cargo, categoria, sala, utilizador)
 * Default items are identified by the isDefault flag and cannot be deleted
 */

export interface DefaultItem {
  id: number;
  nome: string;
  isDefault: boolean;
  [key: string]: any;
}

/**
 * Check if an item is a default item
 */
export const isDefaultItem = (item: any): boolean => {
  return item?.isDefault === true;
};

/**
 * Check if a list contains a default item
 */
export const hasDefaultInList = (items: any[]): boolean => {
  return items.some(isDefaultItem);
};

/**
 * Get the default item from a list
 */
export const getDefaultFromList = (items: any[]): DefaultItem | null => {
  return items.find(isDefaultItem) || null;
};

/**
 * Filter out default items from a list
 */
export const filterOutDefaults = (items: any[]): any[] => {
  return items.filter((item) => !isDefaultItem(item));
};

/**
 * Separate defaults from non-defaults in a list
 */
export const separateDefaults = (
  items: any[],
): {
  defaults: any[];
  nonDefaults: any[];
} => {
  const defaults: any[] = [];
  const nonDefaults: any[] = [];

  items.forEach((item) => {
    if (isDefaultItem(item)) {
      defaults.push(item);
    } else {
      nonDefaults.push(item);
    }
  });

  return { defaults, nonDefaults };
};

/**
 * Get the appropriate delete confirmation message for an item
 */
export const getDeleteConfirmationMessage = (
  itemType: "cargo" | "categoria" | "sala" | "utilizador",
  itemName: string,
  isDefault: boolean = false,
): string => {
  if (isDefault) {
    const typeLabel = {
      cargo: "cargo padr\u00e3o",
      categoria: "categoria padr\u00e3o",
      sala: "sala padr\u00e3o",
      utilizador: "utilizador padr\u00e3o",
    }[itemType];

    return `N\u00e3o \u00e9 poss\u00edvel eliminar o ${typeLabel}. O item "${itemName}" \u00e9 essencial para o funcionamento do sistema.`;
  }

  const typeLabel = {
    cargo: "cargo",
    categoria: "categoria",
    sala: "sala",
    utilizador: "utilizador",
  }[itemType];

  return `Tem a certeza que deseja eliminar o ${typeLabel} "${itemName}"? Esta a\u00e7\u00e3o n\u00e3o pode ser desfeita.`;
};

/**
 * Check if deletion is allowed for an item
 */
export const canDeleteItem = (item: any): boolean => {
  return !isDefaultItem(item);
};

/**
 * Get alert message for attempting to delete a default item
 */
export const getDefaultProtectionAlert = (
  itemType: "cargo" | "categoria" | "sala" | "utilizador",
): string => {
  const typeLabel = {
    cargo: "Cargo",
    categoria: "Categoria",
    sala: "Sala",
    utilizador: "Utilizador",
  }[itemType];

  return `${typeLabel} padr\u00e3o n\u00e3o pode ser elimina do. Este item \u00e9 essencial para o funcionamento do sistema.`;
};

/**
 * API endpoint helper - get default item endpoint
 */
export const getDefaultEndpoint = (
  resourceType: "cargo" | "categoria" | "localizacao" | "utilizador",
): string => {
  const baseEndpoints = {
    cargo: "/cargo/default",
    categoria: "/categoria/default",
    localizacao: "/localizacao/default",
    utilizador: "/utilizador/default",
  };

  return baseEndpoints[resourceType];
};

/**
 * API endpoint helper - get list endpoint (excludes defaults)
 */
export const getListEndpoint = (
  resourceType: "cargo" | "categoria" | "localizacao" | "utilizador",
): string => {
  const baseEndpoints = {
    cargo: "/cargo",
    categoria: "/categoria",
    localizacao: "/localizacao",
    utilizador: "/utilizador",
  };

  return baseEndpoints[resourceType];
};
