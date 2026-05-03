import express from "express";
import prisma from "../lib/prisma.js";
import { ItemService } from "../services/item.service.ts";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { tenantIsolation } from "../middlewares/tenantIsolation.middleware.js";
import { requirePermission } from "../middlewares/permissions.middleware.js";
import { PERMISSIONS } from "../constants/permissions.constants.js";
import { handlePrismaError } from "../lib/errorHandler.js";
import { RecordService } from "../services/records.service.ts";
import { parseDateRange } from "../lib/utils.js";

const router = express.Router();

router.use(authMiddleware);
router.use(tenantIsolation);

router.get("/", requirePermission(PERMISSIONS.ITEM_READ), async (req, res) => {
  const instituicaoId = req.tenantId;
  const { startDate, endDate } = req.query;

  // Parse and validate date range
  const {
    startDate: parsedStart,
    endDate: parsedEnd,
    isInvalid,
  } = parseDateRange(startDate, endDate);

  // If date range is invalid, return empty array
  if (isInvalid) {
    return res.json({
      data: [],
      error: null,
    });
  }

  const items = await prisma.item.findMany({
    where: {
      deletedAt: null,
      categoria: { instituicaoId },
      createdAt: {
        gte: parsedStart,
        lte: parsedEnd,
      },
    },
    include: {
      categoria: true,
      condicao: true,
      sala: true,
    },
  });

  res.json({
    data: items.map((item) => ({
      id: item.id,
      nome: item.nome,
      descricao: item.descricao ?? "",
      quantity: item.quantidade,
      serialNumber: item.serialNumber ?? "",
      updatedAt: item.updatedAt,
      category: {
        value: item.categoria.id,
        label: item.categoria.nome ?? "",
      },
      status: {
        value: item.condicao.id,
        label: item.condicao.nome ?? "",
      },
      location: {
        value: item.sala.id,
        label: item.sala.numeroSala ?? "",
      },
    })),
    error: null,
  });
});
router.get(
  "/:id",
  requirePermission(PERMISSIONS.ITEM_READ),
  async (req, res) => {
    const item = await prisma.item.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        categoria: true,
        condicao: true,
        sala: true,
      },
    });

    if (!item || item.deletedAt) {
      return res.status(404).json({ data: null, error: "Item not found" });
    }

    res.json({
      data: {
        id: item.id,
        nome: item.nome,
        descricao: item.descricao ?? "",
        quantity: item.quantidade,
        serialNumber: item.serialNumber ?? "",
        updatedAt: item.updatedAt,
        category: {
          value: item.categoria.id,
          label: item.categoria.nome ?? "",
        },
        status: {
          value: item.condicao.id,
          label: item.condicao.nome ?? "",
        },
        location: {
          value: item.sala.id,
          label: item.sala.numeroSala ?? "",
        },
      },
      error: null,
    });
  },
);

router.post(
  "/create",
  requirePermission(PERMISSIONS.ITEM_CREATE),
  async (req, res) => {
    const instituicaoId = req.tenantId;
    const utilizadorId = req.tenantId;

    const {
      nome,
      descricao,
      quantidade,
      serialNumber,
      categoriaId,
      condicaoId,
      salaId,
    } = req.body;

    if (
      !nome ||
      !categoriaId ||
      isNaN(parseInt(categoriaId)) ||
      !condicaoId ||
      isNaN(parseInt(condicaoId)) ||
      !salaId ||
      isNaN(parseInt(salaId)) ||
      !serialNumber
    ) {
      return res
        .status(400)
        .json({ data: null, error: "Todos os campos são obrigatórios" });
    }

    const categoria = await prisma.categoria.findUnique({
      where: { id: parseInt(categoriaId) },
    });

    const condicao = await prisma.condicao.findUnique({
      where: { id: parseInt(condicaoId) },
    });

    const sala = await prisma.sala.findUnique({
      where: { id: parseInt(salaId) },
    });

    if (!categoria || !condicao || !sala) {
      return res.status(404).json({
        message: "Por favor, verifique todos os campos e tente novamente",
        data: null,
        error:
          "Um dos itens não foi encontrado: " +
          (categoria ? "" : "Categoria") +
          (condicao ? "" : "Condição") +
          (sala ? "" : "Sala"),
      });
    }

    try {
      const newItem = await ItemService.createItem({
        nome,
        descricao,
        quantidade,
        serialNumber,
        categoriaId,
        condicaoId,
        salaId,
      });

      // Create registo record for item creation
      const registo = await RecordService.createRecord({
        instituicaoId: req.tenantId,
        itemId: newItem.id,
        quantidade: newItem.quantidade,
        type: "in",
        utilizadorId: req.userId,
      });

      return res.status(201).json({
        message: "Item registado com sucesso",
        data: { item: newItem, registo },
        error: null,
      });
    } catch (error) {
      const { status, message } = handlePrismaError(error);
      res.status(status).json({ message, data: null, error });
    }
  },
);

router.put(
  "/update/:id",
  requirePermission(PERMISSIONS.ITEM_UPDATE),
  async (req, res) => {
    const {
      nome,
      descricao,
      quantidade,
      serialNumber,
      categoriaId,
      condicaoId,
      salaId,
      reason,
    } = req.body;

    const item = await prisma.item.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (
      (!nome || String(nome) === String(item.nome)) &&
      (!descricao || String(descricao) === String(item.descricao)) &&
      (!quantidade || String(quantidade) === String(item.quantidade)) &&
      (!serialNumber || String(serialNumber) === String(item.serialNumber)) &&
      (!categoriaId || String(categoriaId) === String(item.categoriaId)) &&
      (!condicaoId || String(condicaoId) === String(item.condicaoId)) &&
      (!salaId || String(salaId) === String(item.salaId))
    ) {
      return res.status(400).json({
        message: "Nada para atualizar",
        data: null,
        error: "At least one field must be provided for update",
      });
    }

    if (!item || item.deletedAt) {
      return res.status(404).json({ data: null, error: "Item not found" });
    }

    const categoria = categoriaId
      ? await prisma.categoria.findUnique({
          where: { id: parseInt(categoriaId) },
        })
      : null;

    const condicao = condicaoId
      ? await prisma.condicao.findUnique({
          where: { id: parseInt(condicaoId) },
        })
      : null;

    const sala = salaId
      ? await prisma.sala.findUnique({
          where: { id: parseInt(salaId) },
        })
      : null;

    if (categoriaId && !categoria) {
      return res
        .status(404)
        .json({ data: null, message: "Categoria não encontrada" });
    }
    if (condicaoId && !condicao) {
      return res
        .status(404)
        .json({ data: null, message: "Condição não encontrada" });
    }
    if (salaId && !sala) {
      return res
        .status(404)
        .json({ data: null, message: "Sala não encontrada" });
    }

    try {
      const newItem = await ItemService.updateItem(item.id, {
        nome,
        descricao,
        quantidade,
        serialNumber,
        categoriaId,
        condicaoId,
        salaId,
      });

      // Create registo record only if location (salaId) changed
      if (salaId && String(salaId) !== String(item.salaId)) {
        const registo = await RecordService.createRecord({
          instituicaoId: req.tenantId,
          itemId: newItem.id,
          quantidade: newItem.quantidade,
          utilizadorId: req.userId,
          type: "transfer",
          reason,
        });
      }

      res.json({ data: newItem, error: null });
    } catch (error) {
      const { status, message } = handlePrismaError(error);
      res.status(status).json({ data: null, message });
    }
  },
);

router.delete(
  "/:id",
  requirePermission(PERMISSIONS.ITEM_DELETE),
  async (req, res) => {
    const { reason } = req.body;

    const item = await prisma.item.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!item || item.deletedAt) {
      return res.status(404).json({ data: null, error: "Item not found" });
    }

    try {
      const deletedItem = await prisma.item.update({
        where: { id: item.id },
        data: { deletedAt: new Date() },
      });

      // Create registo record for item deletion (soft delete)
      const registo = await RecordService.createRecord({
        instituicaoId: req.tenantId,
        itemId: deletedItem.id,
        quantidade: deletedItem.quantidade,
        utilizadorId: req.userId,
        type: "out",
        reason,
      });

      res.json({ data: deletedItem, error: null });
    } catch (error) {
      res.status(500).json({ data: null, error: error.message });
    }
  },
);

export default router;
