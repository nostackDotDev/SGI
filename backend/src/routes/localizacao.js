import express from "express";
import prisma from "../lib/prisma.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requirePermission } from "../middlewares/permissions.middleware.js";
import { tenantIsolation } from "../middlewares/tenantIsolation.middleware.js";
import { PERMISSIONS } from "../constants/permissions.constants.js";
import { handlePrismaError } from "../lib/errorHandler.js";

const router = express.Router();

router.use(authMiddleware);
router.use(tenantIsolation);

router.get("/", requirePermission(PERMISSIONS.SALA_READ), async (req, res) => {
  const salas = await prisma.sala.findMany({
    where: {
      deletedAt: null,
      departamento: {
        instituicaoId: req.tenantId,
      },
    },
    include: { departamento: true, itens: true },
  });

  const safeSalas = salas.map((sala) => ({
    id: sala.id,
    nome: sala.numeroSala,
    tipo: sala.tipoSala,
    departamento: sala.departamento?.nome ?? "Sem departamento",
    updatedAt: sala.updatedAt,
    itens: sala.itens.map((item) => ({
      id: item.id,
      nomeItem: item.nome,
    })),
    instituicaoId: sala.departamento?.instituicaoId ?? null,
  }));

  res.json({
    data: safeSalas,
    error: null,
    message: "Sala routes are working!",
  });
});

router.get(
  "/:id",
  requirePermission(PERMISSIONS.SALA_READ),
  async (req, res) => {
    const sala = await prisma.sala.findUnique({
      where: {
        id: parseInt(req.params.id),
        departamento: {
          instituicaoId: req.tenantId,
        },
      },
      include: { departamento: true, itens: true },
    });

    if (!sala || sala.deletedAt) {
      return res.status(404).json({ data: null, error: "Sala not found" });
    }

    const safeSala = {
      id: sala.id,
      nome: sala.numeroSala,
      tipo: sala.tipoSala,
      departamento: sala.departamento?.nome ?? "",
      updatedAt: sala.updatedAt,
      itens: sala.itens.map((item) => ({
        id: item.id,
        nomeItem: item.nome,
      })),
    };

    res.json({ data: safeSala, error: null });
  },
);

router.post(
  "/create",
  requirePermission(PERMISSIONS.SALA_CREATE),
  async (req, res) => {
    const { numeroSala, tipoSala, departamentoId } = req.body;

    if (!numeroSala || !departamentoId || isNaN(parseInt(departamentoId))) {
      return res
        .status(400)
        .json({ data: null, error: "Número e departamento são obrigatórios" });
    }

    const departamento = await prisma.departamento.findUnique({
      where: {
        id: parseInt(departamentoId),
        instituicaoId: req.tenantId,
      },
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
          departamentoId: parseInt(departamentoId),
        },
      });

      res.status(201).json({ data: newSala, error: null });
    } catch (error) {
      const { status, message } = handlePrismaError(error);
      res.status(status).json({ data: null, message });
    }
  },
);

router.put(
  "/update/:id",
  requirePermission(PERMISSIONS.SALA_UPDATE),
  async (req, res) => {
    const { numeroSala, tipoSala, departamentoId } = req.body;

    if (
      (!numeroSala && !tipoSala && !departamentoId) ||
      isNaN(parseInt(departamentoId))
    ) {
      return res.status(400).json({
        message: "Nenhum campo para atualizar fornecido",
        data: null,
        error: "At least one field must be provided for update",
      });
    }

    const sala = await prisma.sala.findUnique({
      where: {
        id: parseInt(req.params.id),
        departamento: {
          instituicaoId: req.tenantId,
        },
      },
    });

    if (!sala || sala.deletedAt) {
      return res.status(404).json({ data: null, error: "Sala not found" });
    }

    const departamento = departamentoId
      ? await prisma.departamento.findUnique({
          where: {
            id: parseInt(departamentoId),
            instituicaoId: req.tenantId,
          },
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
          departamentoId: departamentoId
            ? parseInt(departamentoId)
            : sala.departamentoId,
        },
      });

      res.json({ data: { ...newSala }, error: null });
    } catch (error) {
      const { status, message } = handlePrismaError(error);
      res.status(status).json({ data: null, message });
    }
  },
);

router.delete(
  "/:id",
  requirePermission(PERMISSIONS.SALA_DELETE),
  async (req, res) => {
    const sala = await prisma.sala.findUnique({
      where: {
        id: parseInt(req.params.id),
        departamento: {
          instituicaoId: req.tenantId,
        },
      },
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
