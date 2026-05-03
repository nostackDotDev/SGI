import express from "express";
import prisma from "../lib/prisma.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requirePermission } from "../middlewares/permissions.middleware.js";
import { tenantIsolation } from "../middlewares/tenantIsolation.middleware.js";
import { PERMISSIONS } from "../constants/permissions.constants.js";

const router = express.Router();

router.use(authMiddleware);
router.use(tenantIsolation);

router.get(
  "/",
  requirePermission(PERMISSIONS.INSTITUICAO_READ),
  async (req, res) => {
    const instituicao = await prisma.instituicao.findUnique({
      where: { id: req.tenantId },
      include: {
        departamentos: true,
        cargos: true,
        utilizadores: true,
        categorias: true,
      },
    });

    res.json({ data: instituicao, error: null });
  },
);

router.get(
  "/:id",
  requirePermission(PERMISSIONS.INSTITUICAO_READ),
  async (req, res) => {
    if (parseInt(req.params.id) !== req.tenantId) {
      return res.status(403).json({ data: null, error: "Access denied" });
    }

    const instituicao = await prisma.instituicao.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        departamentos: true,
        cargos: true,
        utilizadores: true,
        categorias: true,
      },
    });

    if (!instituicao || instituicao.deletedAt) {
      return res
        .status(404)
        .json({ data: null, error: "Instituição not found" });
    }

    res.json({ data: instituicao, error: null });
  },
);

router.post(
  "/create",
  requirePermission(PERMISSIONS.INSTITUICAO_CREATE),
  async (req, res) => {
    return res
      .status(403)
      .json({
        data: null,
        error: "Institution creation is not allowed via this endpoint",
      });
  },
);

router.put(
  "/update/:id",
  requirePermission(PERMISSIONS.INSTITUICAO_UPDATE),
  async (req, res) => {
    if (parseInt(req.params.id) !== req.tenantId) {
      return res.status(403).json({ data: null, error: "Access denied" });
    }

    const { nome, descricao, endereco, status } = req.body;

    if (!nome && !descricao && !endereco && !status) {
      return res.status(400).json({
        message: "Nenhum campo para atualizar fornecido",
        data: null,
        error: "At least one field must be provided for update",
      });
    }

    const instituicao = await prisma.instituicao.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!instituicao || instituicao.deletedAt) {
      return res
        .status(404)
        .json({ data: null, error: "Instituição not found" });
    }

    try {
      const newInstituicao = await prisma.instituicao.update({
        where: { id: instituicao.id },
        data: {
          nome: nome || instituicao.nome,
          descricao: descricao || instituicao.descricao,
          endereco: endereco || instituicao.endereco,
          status: status || instituicao.status,
        },
      });

      res.json({ data: newInstituicao, error: null });
    } catch (error) {
      res.status(500).json({ data: null, error: error.message });
    }
  },
);

router.delete(
  "/:id",
  requirePermission(PERMISSIONS.INSTITUICAO_DELETE),
  async (req, res) => {
    if (parseInt(req.params.id) !== req.tenantId) {
      return res.status(403).json({ data: null, error: "Access denied" });
    }

    const instituicao = await prisma.instituicao.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!instituicao || instituicao.deletedAt) {
      return res
        .status(404)
        .json({ data: null, error: "Instituição not found" });
    }

    try {
      const deletedInstituicao = await prisma.instituicao.update({
        where: { id: instituicao.id },
        data: { deletedAt: new Date() },
      });

      res.json({ data: deletedInstituicao, error: null });
    } catch (error) {
      res.status(500).json({ data: null, error: error.message });
    }
  },
);

export default router;
