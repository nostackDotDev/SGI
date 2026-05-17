import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

export async function authMiddleware(req, res, next) {
  const accessToken =
    req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];

  if (!accessToken) {
    return res.status(401).json({
      message: "Unauthorized",
      data: null,
      error: "No token provided",
    });
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

    const user = await prisma.utilizador.findFirst({
      where: {
        id: decoded.userId,
        deletedAt: null, // SECURITY: Check user not soft-deleted
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
        data: null,
        error: "User not found or has been deleted",
      });
    }

    req.user = {
      id: decoded.userId,
      instituicaoId: decoded.instituicaoId,
      cargoId: decoded.cargoId,
    };
    next();
  } catch (error) {
    // Clear invalid access token
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    return res.status(401).json({
      message: "Unauthorized",
      data: null,
      error: error?.message ?? error,
    });
  }
}
