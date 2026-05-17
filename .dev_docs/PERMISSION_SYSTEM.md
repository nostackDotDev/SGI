# Permission System Documentation

A comprehensive permission-based access control system for the SGI application.

## Overview

The permission system allows you to:

- Check if a user has specific permissions
- Conditionally render UI elements based on permissions
- Disable/enable buttons and interactive elements
- Show different content based on permission levels

## Backend Setup

Permissions are:

1. **Fetched from the database** based on user's role (cargo)
2. **Returned with login response** (included in user object)
3. **Applied as overrides** - individual users can have their permissions modified

## Frontend Usage

### 1. Using the `usePermission` Hook

The simplest way to check permissions in your component:

```tsx
import { usePermission } from "@/hooks/usePermission";
import { PERMISSIONS } from "@/core/constants/permissions";

export function MyComponent() {
  const { can, canCreate, canDelete } = usePermission();

  return (
    <div>
      {can(PERMISSIONS.ITEM_CREATE) && <button>Create Item</button>}

      {canDelete("ITEM") && <button>Delete Item</button>}
    </div>
  );
}
```

#### Available Methods

- **`can(permission: string)`** - Check if user has a specific permission
- **`canAny(permissions: string[])`** - Check if user has ANY of the given permissions
- **`canAll(permissions: string[])`** - Check if user has ALL of the given permissions
- **`canCreate(feature: string)`** - Shorthand for `FEATURE_CREATE`
- **`canRead(feature: string)`** - Shorthand for `FEATURE_READ`
- **`canUpdate(feature: string)`** - Shorthand for `FEATURE_UPDATE`
- **`canDelete(feature: string)`** - Shorthand for `FEATURE_DELETE`

### 2. Using the `PermissionGuard` Component

Conditionally render content based on permissions:

```tsx
import { PermissionGuard } from "@/components/auth/PermissionGuard";
import { PERMISSIONS } from "@/core/constants/permissions";

// Simple: Show content only if user has permission
<PermissionGuard permission={PERMISSIONS.ITEM_CREATE}>
  <button>Create Item</button>
</PermissionGuard>

// With multiple permissions (requires ANY):
<PermissionGuard permissions={[PERMISSIONS.ITEM_CREATE, PERMISSIONS.ITEM_UPDATE]}>
  <button>Edit</button>
</PermissionGuard>

// With multiple permissions (requires ALL):
<PermissionGuard
  permissions={[PERMISSIONS.ITEM_READ, PERMISSIONS.ITEM_DELETE]}
  requireAll
>
  <button>Advanced Action</button>
</PermissionGuard>

// With fallback content:
<PermissionGuard
  permission={PERMISSIONS.ITEM_DELETE}
  fallback={<span className="text-muted-foreground">No access</span>}
>
  <button>Delete</button>
</PermissionGuard>
```

### 3. Using `IfPermission` and `IfPermissionElse` Shorthands

Simpler syntax for common cases:

```tsx
import { IfPermission, IfPermissionElse } from "@/components/auth/PermissionGuard";

// Show if permission granted
<IfPermission permission={PERMISSIONS.ITEM_DELETE}>
  <button>Delete Item</button>
</IfPermission>

// Show content if permitted, otherwise show fallback
<IfPermissionElse
  permission={PERMISSIONS.ITEM_UPDATE}
  fallback={<span>Read-only</span>}
>
  <button>Edit Item</button>
</IfPermissionElse>
```

### 4. Using `PermissionDisabled` - Disable Elements

Disable interactive elements if user lacks permission (instead of hiding them):

```tsx
import { PermissionDisabled } from "@/components/auth/PermissionDisabled";

// Disable button if user doesn't have permission
<PermissionDisabled permission={PERMISSIONS.ITEM_DELETE}>
  <button>Delete</button>
</PermissionDisabled>

// With tooltip message on hover
<PermissionDisabled
  permission={PERMISSIONS.ITEM_DELETE}
  tooltip="You don't have permission to delete items"
>
  <button>Delete</button>
</PermissionDisabled>

// Multiple permissions (requires ANY)
<PermissionDisabled
  permissions={[PERMISSIONS.ITEM_CREATE, PERMISSIONS.ITEM_UPDATE]}
>
  <button>Edit or Create</button>
</PermissionDisabled>

// Multiple permissions (requires ALL)
<PermissionDisabled
  permissions={[PERMISSIONS.ITEM_READ, PERMISSIONS.ITEM_DELETE]}
  requireAll
>
  <button>Full Access</button>
</PermissionDisabled>
```

### 5. Using `WithPermissionClasses` - Conditional Styling

Add/remove CSS classes based on permissions:

```tsx
import { WithPermissionClasses } from "@/components/auth/PermissionDisabled";

// Gray out button if no permission
<WithPermissionClasses
  permission={PERMISSIONS.ITEM_DELETE}
  deniedClass="opacity-50 pointer-events-none"
>
  <button>Delete</button>
</WithPermissionClasses>;
```

### 6. Getting Permission Labels

Display permission names in user-friendly format:

```tsx
import { getPermissionLabel, mapPermissionLabels } from "@/lib/authContext";

// Get single permission label
const label = getPermissionLabel("ITEM_CREATE"); // "Criar itens"

// Get labels for multiple permissions
const labels = mapPermissionLabels(["ITEM_READ", "ITEM_CREATE"]);
// [{ key: "ITEM_READ", label: "Visualizar itens" }, ...]
```

## Available Permissions

All permissions follow the pattern: `{FEATURE}_{ACTION}`

Features:

- `ITEM` - Inventory items
- `USER` - Users/Utilizadores
- `CARGO` - Roles
- `CATEGORIA` - Categories
- `SALA` - Rooms
- `DEPARTAMENTO` - Departments
- `INSTITUICAO` - Institution
- `CONDICAO` - Conditions
- `REGISTO` - Records
- `RELATORIO` - Reports

Actions:

- `READ` - View/List
- `CREATE` - Create
- `UPDATE` - Modify
- `DELETE` - Remove

Example: `ITEM_CREATE`, `USER_DELETE`, `RELATORIO_READ`

## Real-World Examples

### Example 1: Users Page with Conditional Buttons

```tsx
import { usePermission } from "@/hooks/usePermission";
import {
  IfPermission,
  PermissionDisabled,
} from "@/components/auth/PermissionGuard";
import { PERMISSIONS } from "@/core/constants/permissions";

export function UsersPage() {
  const { canCreate, canDelete } = usePermission();

  return (
    <div>
      <h1>Users</h1>

      {/* Hide entirely if no create permission */}
      <IfPermission permission={PERMISSIONS.USER_CREATE}>
        <button>+ New User</button>
      </IfPermission>

      {/* UserCard with conditional delete button */}
      {users.map((user) => (
        <div key={user.id}>
          <h3>{user.name}</h3>

          {/* Show but disable if no permission */}
          <PermissionDisabled
            permission={PERMISSIONS.USER_DELETE}
            tooltip="You don't have permission to delete users"
          >
            <button>Delete</button>
          </PermissionDisabled>
        </div>
      ))}
    </div>
  );
}
```

### Example 2: Conditional Page Access

```tsx
import { PermissionGuard } from "@/components/auth/PermissionGuard";
import { PERMISSIONS } from "@/core/constants/permissions";

export function ReportsPage() {
  return (
    <PermissionGuard
      permission={PERMISSIONS.RELATORIO_READ}
      fallback={
        <div className="p-4 text-center">
          <p className="text-red-500">You don't have access to reports</p>
        </div>
      }
    >
      <div>{/* Reports content here */}</div>
    </PermissionGuard>
  );
}
```

### Example 3: Complex Feature Access

```tsx
import { usePermission } from "@/hooks/usePermission";
import { PermissionGuard } from "@/components/auth/PermissionGuard";

export function ItemActions({ item }) {
  const { canAny, canAll } = usePermission();

  return (
    <div className="flex gap-2">
      {/* Can view item details */}
      <PermissionGuard permission="ITEM_READ">
        <button>View</button>
      </PermissionGuard>

      {/* Can edit if has read OR update permission */}
      <PermissionGuard permissions={["ITEM_READ", "ITEM_UPDATE"]}>
        <button>Edit</button>
      </PermissionGuard>

      {/* Can perform dangerous operation only if has all permissions */}
      <PermissionGuard
        permissions={["ITEM_READ", "ITEM_UPDATE", "ITEM_DELETE"]}
        requireAll
        fallback={
          <span className="text-xs text-muted-foreground">Limited access</span>
        }
      >
        <button className="text-red-600">Advanced Delete</button>
      </PermissionGuard>
    </div>
  );
}
```

## Best Practices

1. **Use Constants** - Always import and use `PERMISSIONS` constants instead of hardcoding strings

   ```tsx
   // ✅ Good
   <PermissionGuard permission={PERMISSIONS.ITEM_CREATE}>

   // ❌ Bad
   <PermissionGuard permission="ITEM_CREATE">
   ```

2. **Choose the Right Component**
   - **Hide content** - Use `PermissionGuard` or `IfPermission`
   - **Disable but show** - Use `PermissionDisabled` for transparency
   - **Logical checks** - Use `usePermission` hook in complex logic

3. **Provide Feedback**
   - Add tooltips when disabling buttons
   - Show fallback messages when hiding content
   - Make it clear why users can't access something

4. **Group Related Permissions**

   ```tsx
   {
     /* Better than checking individually */
   }
   <PermissionGuard permissions={["ITEM_CREATE", "ITEM_UPDATE"]}>
     <Button>Manage Items</Button>
   </PermissionGuard>;
   ```

5. **Test Permissions**
   - Create test users with different permission levels
   - Verify all permission-guarded features work as expected
