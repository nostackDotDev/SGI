import { getPermissions } from "../lib/utils.js";

export function requirePermission(permission) {
  return (req, res, next) => {
    const cargo = req.user.cargo;

    const permissions = getPermissions(cargo);

    if (!permissions.includes(permission)) {
      return res
        .status(403)
        .json({
          message: "Sem permissão para realizar esta ação",
          data: null,
          error: "Forbidden",
        });
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
