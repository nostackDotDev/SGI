import { useAuth } from "@/core/contexts/AuthContext";

/**
 * Hook to check user permissions
 * Usage: const { can } = usePermission()
 *        if (can('ITEM_CREATE')) { ... }
 */
export function usePermission() {
  const { hasPermission } = useAuth();

  return {
    /**
     * Check if user has a specific permission
     */
    can: (permission: string): boolean => hasPermission(permission),

    /**
     * Check if user has ANY of the given permissions
     */
    canAny: (permissions: string[]): boolean =>
      permissions.some((p) => hasPermission(p)),

    /**
     * Check if user has ALL of the given permissions
     */
    canAll: (permissions: string[]): boolean =>
      permissions.every((p) => hasPermission(p)),

    /**
     * Check if user can perform CRUD on a feature
     */
    canCreate: (feature: string): boolean => hasPermission(`${feature}_CREATE`),
    canRead: (feature: string): boolean => hasPermission(`${feature}_READ`),
    canUpdate: (feature: string): boolean => hasPermission(`${feature}_UPDATE`),
    canDelete: (feature: string): boolean => hasPermission(`${feature}_DELETE`),
  };
}
