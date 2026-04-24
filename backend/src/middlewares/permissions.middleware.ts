import { request, response, NextFunction } from "express";
import { getUserPermissions } from "../services/permissions.service";

export function requirePermission(permission: string) {
  return async (req: request, res: response, next: NextFunction) => {
    try {
      const userId = req.user.id;

      const permissions = await getUserPermissions(userId);

      if (!permissions.has(permission)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      next();
    } catch (err) {
      next(err);
    }
  };
}
