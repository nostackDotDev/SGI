import prisma from "../lib/prisma.js";
import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "Welcome to the API",
    endpoints: {
      empty: false,
    },
  });
});

export default router;
