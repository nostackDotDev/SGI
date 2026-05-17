import React from "react";
import { usePermission } from "@/hooks/usePermission";

interface PermissionGuardProps {
  permission?: string;
  permissions?: string[];
  fallback?: React.ReactNode;
  requireAll?: boolean;
  children: React.ReactNode;
}

/**
 * PermissionGuard - Conditionally renders content based on user permissions
 *
 * Usage:
 * <PermissionGuard permission="ITEM_CREATE">
 *   <Button>Create Item</Button>
 * </PermissionGuard>
 *
 * With multiple permissions (requires ANY):
 * <PermissionGuard permissions={["ITEM_CREATE", "ITEM_UPDATE"]}>
 *   <Button>Edit</Button>
 * </PermissionGuard>
 *
 * With requireAll (requires ALL):
 * <PermissionGuard permissions={["ITEM_READ", "ITEM_DELETE"]} requireAll>
 *   <Button>Advanced Delete</Button>
 * </PermissionGuard>
 *
 * With fallback:
 * <PermissionGuard permission="ITEM_DELETE" fallback={<span>No access</span>}>
 *   <Button>Delete</Button>
 * </PermissionGuard>
 */
export function PermissionGuard({
  permission,
  permissions,
  fallback,
  requireAll = false,
  children,
}: PermissionGuardProps) {
  const { can, canAny, canAll } = usePermission();

  let hasPermission = false;

  if (permission) {
    hasPermission = can(permission);
  } else if (permissions && permissions.length > 0) {
    hasPermission = requireAll ? canAll(permissions) : canAny(permissions);
  }

  return hasPermission ? <>{children}</> : <>{fallback}</>;
}

interface IfPermissionProps {
  permission: string;
  children: React.ReactNode;
}

/**
 * Shorthand for rendering content only if permission is granted
 * Usage: <IfPermission permission="ITEM_DELETE"><Button>Delete</Button></IfPermission>
 */
export function IfPermission({ permission, children }: IfPermissionProps) {
  return <PermissionGuard permission={permission}>{children}</PermissionGuard>;
}

interface IfPermissionElseProps {
  permission: string;
  children: React.ReactNode;
  fallback: React.ReactNode;
}

/**
 * Render content if permission is granted, otherwise render fallback
 * Usage: <IfPermissionElse permission="ITEM_DELETE" fallback={<span>Not allowed</span>}><Button>Delete</Button></IfPermissionElse>
 */
export function IfPermissionElse({
  permission,
  children,
  fallback,
}: IfPermissionElseProps) {
  return (
    <PermissionGuard permission={permission} fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}
