import express from "express";
import prisma from "../lib/prisma.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { tenantIsolation } from "../middlewares/tenantIsolation.middleware.js";
import { requirePermission } from "../middlewares/permissions.middleware.js";
import { PERMISSIONS } from "../constants/permissions.constants.js";

const router = express.Router();

router.use(authMiddleware);
router.use(tenantIsolation);

router.get(
  "/",
  requirePermission(PERMISSIONS.DEPARTAMENTO_READ),
  async (req, res) => {
    const instituicaoId = req.tenantId;

    const items = await prisma.item.findMany({
      where: {
        categoria: {
          instituicaoId,
        },
      },
    });

    const total =
      items.reduce((prev, curr) => {
        if (curr.deletedAt) return prev; // Skip deleted items
        return prev + (curr.quantidade || 0);
      }, 0) || 0;

    const available =
      items.reduce((prev, curr) => {
        if (curr.deletedAt) return prev; // Skip deleted items
        if (curr.condicaoId === 1) return prev + (curr.quantidade || 0);
        return prev;
      }, 0) || 0;

    const repair =
      items.reduce((prev, curr) => {
        if (curr.deletedAt) return prev; // Skip deleted items
        if (curr.condicaoId === 2) return prev + (curr.quantidade || 0);
        return prev;
      }, 0) || 0;

    const removed =
      items.reduce((prev, curr) => {
        if (curr.deletedAt) return prev + (curr.quantidade || 0);
        return prev;
      }, 0) || 0;

    res.json({
      data: {
        summary: {
          total,
          available,
          repair,
          removed,
        },
      },
      error: null,
      message: "Dados carregados com sucesso",
    });
  },
);

router.get(
  "/chart-data",
  requirePermission(PERMISSIONS.CATEGORIA_READ),
  async (req, res) => {
    const instituicaoId = req.tenantId;

    const chartData = [
      { name: "Group A", value: 400 },
      { name: "Group B", value: 40 },
      { name: "Group C", value: 400 },
      { name: "Group D", value: 95 },
    ];

    const labels = chartData.map((entry) => entry.name);

    res.json({
      data: {
        chartData,
        labels,
      },
      error: null,
      message: "Dados carregados com sucesso",
    });
  },
);

export default router;
