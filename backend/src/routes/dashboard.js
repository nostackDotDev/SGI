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

    const categorias = await prisma.categoria.findMany({
      where: {
        instituicaoId,
        defaultType: false,
        deletedAt: null,
      },
      include: {
        itens: {
          where: {
            deletedAt: null,
          },
          select: {
            quantidade: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Build chart data with summed quantities
    const mappedData = categorias.map((categoria) => ({
      name: categoria.nome,
      createdAt: categoria.createdAt,
      value: categoria.itens.reduce(
        (total, item) => total + (item.quantidade || 0),
        0,
      ),
    }));

    // Sort by highest quantity first
    const sortedByValue = [...mappedData].sort((a, b) => b.value - a.value);

    // Keep top 5 categories
    const TOP_LIMIT = 5;

    const topCategories = sortedByValue.slice(0, TOP_LIMIT);

    const otherCategories = sortedByValue.slice(TOP_LIMIT);

    // Sum all remaining categories into "Others"
    const othersValue = otherCategories.reduce(
      (total, categoria) => total + categoria.value,
      0,
    );

    // Re-order top categories by creation date
    const finalData = topCategories.sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    );

    // Add "Others" at the end if needed
    if (otherCategories.length > 0) {
      finalData.push({
        name: "Outras Categorias",
        value: othersValue,
      });
    }

    // Remove createdAt before sending response
    const chartData = finalData.map(({ name, value }) => ({
      name,
      value,
    }));

    res.json({
      data: {
        chartData,
        labels: chartData.map((entry) => entry.name),
      },
      error: null,
      message: "Dados carregados com sucesso",
    });
  },
);

export default router;
