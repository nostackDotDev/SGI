import { getUserPermissions } from "../services/permissions.service.js";

export function requirePermission(permission) {
  return async (req, res, next) => {
    try {
      const userId = req.user.id;

      const permissions = await getUserPermissions(userId);

      if (!permissions.has(permission)) {
        return res.status(403).json({
          message: "Sem permissão para realizar esta ação",
          data: null,
          error: "Forbidden",
        });
      }

      next();
    } catch (err) {
      return res.status(500).json({
        message: "Erro ao verificar permissões",
        data: null,
        error: err.message,
      });
    }
  };
}
