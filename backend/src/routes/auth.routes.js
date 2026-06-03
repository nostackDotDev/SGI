import { Router } from "express";
import {
  loginController,
  signupController,
  refreshController,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import prisma from "../lib/prisma.js";

const router = Router();

router.post("/signup", signupController);
router.post("/login", loginController);

// Refresh access token using refresh token
router.post("/refresh", refreshController);

router.get("/me", authMiddleware, (req, res) => {
  res.json({
    user: req.user,
  });
});

router.post("/logout", authMiddleware, async (req, res) => {
  // Validate token before clearing (prevent unauthorized logout)
  // authMiddleware already validated, so we can safely proceed

  // SECURITY: Invalidate refresh token in database
  try {
    await prisma.utilizador.update({
      where: { id: req.user.id },
      data: {
        refreshToken: null,
        refreshTokenExpires: null,
      },
    });
  } catch (error) {
    console.error("Failed to invalidate refresh token:", error);
    // Continue with logout even if DB update fails
  }

  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/"
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/"
  });

  return res.json({
    message: "Logged out successfully",
  });
});

export default router;
