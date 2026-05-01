import express from "express";
import prisma from "../lib/prisma.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { tenantIsolation } from "../middlewares/tenantIsolation.middleware.js";
import { requirePermission } from "../middlewares/permissions.middleware.js";
import { PERMISSIONS } from "../constants/permissions.constants.js";
import { handlePrismaError } from "../lib/errorHandler.js";

const router = express.Router();

router.use(authMiddleware);
router.use(tenantIsolation);

router.get(
  "/",
  requirePermission(PERMISSIONS.CATEGORIA_READ),
  async (req, res) => {
    const instituicaoId = req.tenantId;

    const categorias = await prisma.categoria.findMany({
      where: { instituicaoId, deletedAt: null },
    });

    res.json({ data: categorias, error: null });
  },
);

router.get(
  "/:id",
  requirePermission(PERMISSIONS.CATEGORIA_READ),
  async (req, res) => {
    const instituicaoId = req.tenantId;

    const categoria = await prisma.categoria.findFirst({
      where: {
        id: parseInt(req.params.id),
        instituicaoId,
        deletedAt: null,
      },
    });

    if (!categoria) {
      return res.status(404).json({ data: null, error: "Categoria not found" });
    }

    res.json({ data: categoria, error: null });
  },
);

router.post(
  "/create",
  requirePermission(PERMISSIONS.CATEGORIA_CREATE),
  async (req, res) => {
    const instituicaoId = req.tenantId;
    const { nome, descricao } = req.body;

    if (!nome) {
      return res.status(400).json({ data: null, error: "Nome é obrigatório" });
    }

    try {
      const newCategoria = await prisma.categoria.create({
        data: {
          nome,
          descricao: descricao || "",
          instituicaoId,
        },
      });

      res.status(201).json({ data: newCategoria, error: null });
    } catch (error) {
      const { status, message } = handlePrismaError(error);
      res.status(status).json({ data: null, message });
    }
  },
);

router.put(
  "/update/:id",
  requirePermission(PERMISSIONS.CATEGORIA_UPDATE),
  async (req, res) => {
    const instituicaoId = req.tenantId;
    const { nome, descricao } = req.body;

    if (!nome && !descricao) {
      return res.status(400).json({
        message: "Nenhum campo para atualizar fornecido",
        data: null,
        error: "At least one field must be provided for update",
      });
    }

    const categoria = await prisma.categoria.findFirst({
      where: {
        id: parseInt(req.params.id),
        instituicaoId,
        deletedAt: null,
      },
    });

    if (!categoria) {
      return res.status(404).json({ data: null, error: "Categoria not found" });
    }

    try {
      const updated = await prisma.categoria.update({
        where: { id: categoria.id },
        data: {
          nome: nome ?? categoria.nome,
          descricao: descricao ?? categoria.descricao,
        },
      });

      res.json({ data: updated, error: null });
    } catch (error) {
      const { status, message } = handlePrismaError(error);
      res.status(status).json({ data: null, message });
    }
  },
);

router.delete(
  "/:id",
  requirePermission(PERMISSIONS.CATEGORIA_DELETE),
  async (req, res) => {
    const instituicaoId = req.tenantId;

    const categoria = await prisma.categoria.findFirst({
      where: {
        id: parseInt(req.params.id),
        instituicaoId,
        deletedAt: null,
      },
    });

    if (!categoria) {
      return res.status(404).json({ data: null, error: "Categoria not found" });
    }

    try {
      const deletedCategoria = await prisma.categoria.update({
        where: { id: categoria.id },
        data: { deletedAt: new Date() },
      });

      res.json({ data: deletedCategoria, error: null });
    } catch (error) {
      res.status(500).json({ data: null, error: error.message });
    }
  },
);

export default router;
