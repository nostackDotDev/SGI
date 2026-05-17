import React from "react";
import { usePermission } from "@/hooks/usePermission";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface PermissionDisabledProps {
  permission?: string;
  permissions?: string[];
  requireAll?: boolean;
  children: React.ReactElement;
  tooltip?: string;
}

/**
 * PermissionDisabled - Wraps an element and disables it if permission is not granted
 * Useful for buttons and interactive elements
 *
 * Usage:
 * <PermissionDisabled permission="ITEM_DELETE" tooltip="You don't have permission to delete items">
 *   <Button>Delete</Button>
 * </PermissionDisabled>
 *
 * With multiple permissions:
 * <PermissionDisabled permissions={["ITEM_READ", "ITEM_DELETE"]} requireAll tooltip="Full access required">
 *   <Button>Full Access Action</Button>
 * </PermissionDisabled>
 */
export function PermissionDisabled({
  permission,
  permissions,
  requireAll = false,
  children,
  tooltip,
}: PermissionDisabledProps) {
  const { can, canAny, canAll } = usePermission();

  let hasPermission = false;

  if (permission) {
    hasPermission = can(permission);
  } else if (permissions && permissions.length > 0) {
    hasPermission = requireAll ? canAll(permissions) : canAny(permissions);
  } else {
    // If no permission specified, allow by default
    hasPermission = true;
  }

  const element = React.cloneElement(children, {
    disabled: !hasPermission || children.props.disabled,
    // title: !hasPermission && tooltip ? tooltip : children.props.title,
  });

  if (!hasPermission)
    return (
      <Tooltip>
        <TooltipTrigger asChild>{element}</TooltipTrigger>
        <TooltipContent>
          {tooltip || "Não possui autorização para relaizar esta ação"}
        </TooltipContent>
      </Tooltip>
    );

  return element;
}

interface WithPermissionClassesProps {
  permission?: string;
  permissions?: string[];
  requireAll?: boolean;
  children: React.ReactElement;
  deniedClass?: string;
}

/**
 * WithPermissionClasses - Add/remove CSS classes based on permission
 * Useful for styling elements differently based on permissions
 *
 * Usage:
 * <WithPermissionClasses
 *   permission="ITEM_DELETE"
 *   deniedClass="opacity-50 cursor-not-allowed"
 * >
 *   <Button>Delete (may be grayed out)</Button>
 * </WithPermissionClasses>
 */
export function WithPermissionClasses({
  permission,
  permissions,
  requireAll = false,
  children,
  deniedClass = "opacity-50 pointer-events-none",
}: WithPermissionClassesProps) {
  const { can, canAny, canAll } = usePermission();

  let hasPermission = false;

  if (permission) {
    hasPermission = can(permission);
  } else if (permissions && permissions.length > 0) {
    hasPermission = requireAll ? canAll(permissions) : canAny(permissions);
  } else {
    hasPermission = true;
  }

  const currentClass = children.props.className || "";
  const newClass = hasPermission
    ? currentClass
    : `${currentClass} ${deniedClass}`;

  return React.cloneElement(children, { className: newClass });
}
