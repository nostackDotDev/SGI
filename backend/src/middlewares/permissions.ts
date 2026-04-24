import { getPermissions } from "../lib/utils";
import { Permission } from "../types/tables";

export function requirePermission(permission: Permission) {
  return (req: any, res: any, next: any) => {
    const cargo = req.user.cargo;

    const permissions = getPermissions(cargo);

    if (!permissions.includes(permission)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    next();
  };
}

/* 
-- Using in routes:
Use in routes:
app.delete(
  '/users/:id',
  requirePermission('MANAGE_USERS'),
  controller.deleteUser
)
*/