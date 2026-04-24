import express from "express";
import prisma from "../lib/prisma.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requirePermission } from "../middlewares/permissions.middleware.js";
import { PERMISSIONS } from "../constants/permissions.constants.js";

const router = express.Router();

router.use(authMiddleware);

router.get(
  "/",
  requirePermission(PERMISSIONS.DEPARTAMENTO_READ),
  async (req, res) => {
    const departamentos = await prisma.departamento.findMany({
      where: { deletedAt: null },
      include: { instituicao: true, salas: true },
    });

    res.json({
      data: departamentos,
      error: null,
      message: "Departamento routes are working!",
    });
  },
);

router.get(
  "/:id",
  requirePermission(PERMISSIONS.DEPARTAMENTO_READ),
  async (req, res) => {
    const departamento = await prisma.departamento.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { instituicao: true, salas: true },
    });

    if (!departamento || departamento.deletedAt) {
      return res
        .status(404)
        .json({ data: null, error: "Departamento not found" });
    }

    res.json({ data: departamento, error: null });
  },
);

router.post(
  "/create",
  requirePermission(PERMISSIONS.DEPARTAMENTO_CREATE),
  async (req, res) => {
    const { nome, descricao, instituicaoId } = req.body;

    if (!nome || !instituicaoId) {
      return res
        .status(400)
        .json({ data: null, error: "Nome e instituição são obrigatórias" });
    }

    const instituicao = await prisma.instituicao.findUnique({
      where: { id: instituicaoId },
    });

    if (!instituicao) {
      return res
        .status(404)
        .json({ data: null, error: "Instituição not found" });
    }

    try {
      const newDepartamento = await prisma.departamento.create({
        data: {
          nome,
          descricao: descricao || "",
          instituicaoId,
        },
      });

      res.status(201).json({ data: newDepartamento, error: null });
    } catch (error) {
      res.status(500).json({ data: null, error: error.message });
    }
  },
);

router.put(
  "/update/:id",
  requirePermission(PERMISSIONS.DEPARTAMENTO_UPDATE),
  async (req, res) => {
    const { nome, descricao, instituicaoId, status } = req.body;

    if (!nome && !descricao && !instituicaoId && !status) {
      return res.status(400).json({
        message: "Nenhum campo para atualizar fornecido",
        data: null,
        error: "At least one field must be provided for update",
      });
    }

    const departamento = await prisma.departamento.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!departamento || departamento.deletedAt) {
      return res
        .status(404)
        .json({ data: null, error: "Departamento not found" });
    }

    const instituicao = instituicaoId
      ? await prisma.instituicao.findUnique({
          where: { id: instituicaoId },
        })
      : null;

    if (instituicaoId && !instituicao) {
      return res
        .status(404)
        .json({ data: null, error: "Instituição not found" });
    }

    try {
      const newDepartamento = await prisma.departamento.update({
        where: { id: departamento.id },
        data: {
          nome: nome || departamento.nome,
          descricao: descricao || departamento.descricao,
          instituicaoId: instituicaoId || departamento.instituicaoId,
          status: status || departamento.status,
        },
      });

      res.json({ data: newDepartamento, error: null });
    } catch (error) {
      res.status(500).json({ data: null, error: error.message });
    }
  },
);

router.delete(
  "/:id",
  requirePermission(PERMISSIONS.DEPARTAMENTO_DELETE),
  async (req, res) => {
    const departamento = await prisma.departamento.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!departamento || departamento.deletedAt) {
      return res
        .status(404)
        .json({ data: null, error: "Departamento not found" });
    }

    try {
      const deletedDepartamento = await prisma.departamento.update({
        where: { id: departamento.id },
        data: { deletedAt: new Date() },
      });

      res.json({ data: deletedDepartamento, error: null });
    } catch (error) {
      res.status(500).json({ data: null, error: error.message });
    }
  },
);

export default router;
