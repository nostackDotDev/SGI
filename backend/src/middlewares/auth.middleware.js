import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
      data: null,
      error: "No token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.userId,
      instituicaoId: decoded.instituicaoId,
      cargoId: decoded.cargoId,
    };
    next();
  } catch {
    return res.status(401).json({
      message: "Unauthorized",
      data: null,
      error: "Invalid token",
    });
  }
}
