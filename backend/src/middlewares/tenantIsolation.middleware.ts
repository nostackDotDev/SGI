import { request, response } from "express";

export function tenantIsolation(
  req: request,
  res: response,
  next: NextFunction,
) {
  const user = req.user;

  if (!user?.instituicaoId) {
    return res.status(403).json({ message: "No tenant" });
  }

  req.tenantId = user.instituicaoId;

  next();
}
