export function tenantIsolation(req, res, next) {
  const user = req.user;

  if (!user?.instituicaoId) {
    return res.status(403).json({ message: "No tenant" });
  }

  req.tenantId = user.instituicaoId;

  next();
}
