import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

export async function authMiddleware(req, res, next) {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
      data: null,
      error: "No token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.utilizador.findFirst({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
        data: null,
        error: "User not found",
      });
    }

    req.user = {
      id: decoded.userId,
      instituicaoId: decoded.instituicaoId,
      cargoId: decoded.cargoId,
    };
    next();
  } catch {
    // Clear invalid token
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    return res.status(401).json({
      message: "Unauthorized",
      data: null,
      error: "Invalid token",
    });
  }
}
