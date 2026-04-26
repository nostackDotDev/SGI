import { Router } from "express";
import {
  loginController,
  signupController,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/signup", signupController);
router.post("/login", loginController);

router.get("/me", authMiddleware, (req, res) => {
  res.json({
    user: req.user,
  });
});

router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
  });

  return res.json({
    message: "Logged out successfully",
  });
});

export default router;
