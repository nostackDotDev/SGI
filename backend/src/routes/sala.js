import express from "express";
import prisma from "../lib/prisma.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requirePermission } from "../middlewares/permissions.middleware.js";
import { PERMISSIONS } from "../constants/permissions.constants.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", requirePermission(PERMISSIONS.SALA_READ), async (req, res) => {
  const salas = await prisma.sala.findMany({
    where: { deletedAt: null },
    include: { departamento: true, itens: true },
  });

  res.json({ data: salas, error: null, message: "Sala routes are working!" });
});

router.get(
  "/:id",
  requirePermission(PERMISSIONS.SALA_READ),
  async (req, res) => {
    const sala = await prisma.sala.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { departamento: true, itens: true },
    });

    if (!sala || sala.deletedAt) {
      return res.status(404).json({ data: null, error: "Sala not found" });
    }

    res.json({ data: sala, error: null });
  },
);

router.post(
  "/create",
  requirePermission(PERMISSIONS.SALA_CREATE),
  async (req, res) => {
    const { numeroSala, tipoSala, departamentoId } = req.body;

    if (!numeroSala || !departamentoId) {
      return res
        .status(400)
        .json({ data: null, error: "Número e departamento são obrigatórios" });
    }

    const departamento = await prisma.departamento.findUnique({
      where: { id: departamentoId },
    });

    if (!departamento) {
      return res
        .status(404)
        .json({ data: null, error: "Departamento not found" });
    }

    try {
      const newSala = await prisma.sala.create({
        data: {
          numeroSala,
          tipoSala: tipoSala || "",
          departamentoId,
        },
      });

      res.status(201).json({ data: newSala, error: null });
    } catch (error) {
      res.status(500).json({ data: null, error: error.message });
    }
  },
);

router.put(
  "/update/:id",
  requirePermission(PERMISSIONS.SALA_UPDATE),
  async (req, res) => {
    const { numeroSala, tipoSala, departamentoId, status } = req.body;

    if (!numeroSala && !tipoSala && !departamentoId && !status) {
      return res.status(400).json({
        message: "Nenhum campo para atualizar fornecido",
        data: null,
        error: "At least one field must be provided for update",
      });
    }

    const sala = await prisma.sala.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!sala || sala.deletedAt) {
      return res.status(404).json({ data: null, error: "Sala not found" });
    }

    const departamento = departamentoId
      ? await prisma.departamento.findUnique({
          where: { id: departamentoId },
        })
      : null;

    if (departamentoId && !departamento) {
      return res
        .status(404)
        .json({ data: null, error: "Departamento not found" });
    }

    try {
      const newSala = await prisma.sala.update({
        where: { id: sala.id },
        data: {
          numeroSala: numeroSala || sala.numeroSala,
          tipoSala: tipoSala || sala.tipoSala,
          departamentoId: departamentoId || sala.departamentoId,
        },
      });

      res.json({ data: newSala, error: null });
    } catch (error) {
      res.status(500).json({ data: null, error: error.message });
    }
  },
);

router.delete(
  "/:id",
  requirePermission(PERMISSIONS.SALA_DELETE),
  async (req, res) => {
    const sala = await prisma.sala.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!sala || sala.deletedAt) {
      return res.status(404).json({ data: null, error: "Sala not found" });
    }

    try {
      const deletedSala = await prisma.sala.update({
        where: { id: sala.id },
        data: { deletedAt: new Date() },
      });

      res.json({ data: deletedSala, error: null });
    } catch (error) {
      res.status(500).json({ data: null, error: error.message });
    }
  },
);

export default router;
