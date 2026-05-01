import { Router } from "express";
import {
  loginController,
  signupController,
  refreshController,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

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

router.post("/logout", authMiddleware, (req, res) => {
  // Validate token before clearing (prevent unauthorized logout)
  // authMiddleware already validated, so we can safely proceed

  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return res.json({
    message: "Logged out successfully",
  });
});

export default router;
