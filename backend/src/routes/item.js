import express from "express";
import prisma from "../lib/prisma.js";
import { ItemService } from "../services/item.service.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { tenantIsolation } from "../middlewares/tenantIsolation.middleware.js";
import { requirePermission } from "../middlewares/permissions.middleware.js";
import { PERMISSIONS } from "../constants/permissions.constants.js";
import { handlePrismaError } from "../lib/errorHandler.js";
import { RecordService } from "../services/records.service.js";
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

router.get(
  "/:id/consolidation-history",
  requirePermission(PERMISSIONS.ITEM_READ),
  async (req, res) => {
    try {
      const itemId = parseInt(req.params.id);

      const item = await ItemService.getItemWithConsolidationHistory(itemId);

      if (!item) {
        return res.status(404).json({ data: null, error: "Item not found" });
      }

      res.json({
        data: {
          id: item.id,
          nome: item.nome,
          consolidatedItems: item.consolidatedItems || [],
        },
        error: null,
      });
    } catch (error) {
      console.error("Error fetching consolidation history:", error);
      res.status(500).json({
        data: null,
        error: error.message || "Erro ao buscar histórico de consolidação",
      });
    }
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
        instituicaoId: req.tenantId,
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
      transferType,
    } = req.body;

    const item = await prisma.item.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { condicao: true },
    });

    if (!item || item.deletedAt) {
      return res.status(404).json({ data: null, error: "Item not found" });
    }

    // Handle return transfer type separately
    if (transferType === "return") {
      try {
        // Validate status is "Emprestado"
        if (item.condicao.nome !== "Emprestado") {
          return res.status(400).json({
            data: null,
            error: `Apenas itens com status "Emprestado" podem ser devolvidos. Status atual: ${item.condicao.nome}`,
          });
        }

        // Validate quantity for return
        if (!quantidade) {
          return res.status(400).json({
            data: null,
            error: "Quantidade de devolução é obrigatória",
          });
        }

        ItemService.validateQuantityTransfer(item.quantidade, quantidade);

        // Validate new location exists
        if (!salaId) {
          return res.status(400).json({
            data: null,
            error: "Localização de devolução é obrigatória",
          });
        }

        const newSala = await prisma.sala.findUnique({
          where: { id: parseInt(salaId) },
        });

        if (!newSala) {
          return res.status(404).json({
            data: null,
            error: "Localização de devolução não encontrada",
          });
        }

        // Get "Disponível" condition ID
        const disponivel = await prisma.condicao.findFirst({
          where: { nome: "Disponível" },
        });

        if (!disponivel) {
          return res.status(500).json({
            data: null,
            error: 'Condição "Disponível" não configurada no sistema',
          });
        }

        // Create/update item at new location with returned quantity with "Disponível" status
        // If item with same (nome, serialNumber, salaId) exists, update its quantity
        // Otherwise, create a new item
        const returnedItem = await ItemService.upsertItemAtLocation(
          item.id,
          parseInt(salaId),
          disponivel.id,
          quantidade,
        );

        // Reduce original item quantity
        let updatedOriginal = await prisma.item.update({
          where: { id: item.id },
          data: { quantidade: item.quantidade - Number(quantidade) },
        });

        // If quantity reaches 0, consolidate into the returned item
        if (updatedOriginal.quantidade <= 0) {
          // Consolidate the original item into the returned item
          updatedOriginal = await ItemService.consolidateItem(
            item.id,
            returnedItem.id,
          );

          // Create "consolidation" registo to document the merge event
          await RecordService.createRecord({
            instituicaoId: req.tenantId,
            itemId: returnedItem.id,
            quantidade: Number(quantidade),
            utilizadorId: req.userId,
            type: "consolidation",
            reason: `Consolidado do item anterior (${item.id})`,
          });
        }

        // Create registo record on original item for the return transaction
        const registo = await RecordService.createRecord({
          instituicaoId: req.tenantId,
          itemId: item.id,
          quantidade: Number(quantidade),
          utilizadorId: req.userId,
          type: "return",
          reason,
        });

        return res.json({
          message: "Devolução registada com sucesso",
          data: {
            originalItem: updatedOriginal,
            returnedItem,
            registo,
            consolidatedInto: updatedOriginal.consolidatedIntoItemId
              ? returnedItem.id
              : null,
          },
          error: null,
        });
      } catch (error) {
        console.error("Error in return transfer:", error);
        return res.status(400).json({
          data: null,
          message: error.message || "Erro ao registar devolução",
          error: error.message,
        });
      }
    }

    // Validate that at least one field differs from current values (for non-transfer updates)
    if (
      (!nome || String(nome) === String(item.nome)) &&
      String(descricao) === String(item.descricao) &&
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

      // Create registo record only if location (salaId) changed (regular transfer)
      if (salaId && String(salaId) !== String(item.salaId)) {
        const registo = await RecordService.createRecord({
          instituicaoId: req.tenantId,
          itemId: newItem.id,
          quantidade: newItem.quantidade,
          utilizadorId: req.userId,
          type: transferType ?? "transfer",
          reason,
        });
      }

      res.json({
        data: { ...newItem },
        error: null,
        message: "Item atualizado com sucesso",
      });
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
        data: {
          deletedAt: new Date(),
          uniqueKey: null, // Allow recreating this item
        },
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

/**
 * POST /item/reduction/:id
 * Reduce item quantity at current location
 * Only works for items with "Disponível" status
 */
router.post(
  "/reduction/:id",
  requirePermission(PERMISSIONS.ITEM_UPDATE),
  async (req, res) => {
    const { quantidade, reason } = req.body;
    const itemId = parseInt(req.params.id);

    try {
      // Fetch item with status
      const item = await prisma.item.findUnique({
        where: { id: itemId },
        include: { condicao: true },
      });

      if (!item || item.deletedAt) {
        return res
          .status(404)
          .json({ data: null, error: "Item não encontrado" });
      }

      // Validate status is "Disponível"
      if (item.condicao.nome !== "Disponível") {
        return res.status(400).json({
          message: `Apenas itens com status "Disponível" podem ter reduções. Status atual: ${item.condicao.nome}`,
          data: null,
          error: `Apenas itens com status "Disponível" podem ter reduções. Status atual: ${item.condicao.nome}`,
        });
      }

      // Validate quantity
      ItemService.validateQuantityTransfer(item.quantidade, quantidade);

      // Reduce quantity and auto soft-delete if reaches 0
      const updatedItem = await ItemService.reduceAndDeleteIfZero(
        itemId,
        quantidade,
      );

      // Create registo record
      const registo = await RecordService.createRecord({
        instituicaoId: req.tenantId,
        itemId: itemId,
        quantidade: Number(quantidade),
        utilizadorId: req.userId,
        type: "reduction",
        reason,
      });

      res.json({
        message: "Redução registada com sucesso",
        data: { item: updatedItem, registo },
        error: null,
      });
    } catch (error) {
      console.error("Error in reduction:", error);
      res.status(400).json({
        data: null,
        message: error.message || "Erro ao registar redução",
        error: error.message,
      });
    }
  },
);

/**
 * POST /item/return/:id
 * Return borrowed items from "Emprestado" status
 * Creates new item with "Disponível" status at specified location
 */
router.post(
  "/return/:id",
  requirePermission(PERMISSIONS.ITEM_UPDATE),
  async (req, res) => {
    const { quantidade, salaId, reason, transferType } = req.body;
    const itemId = parseInt(req.params.id);

    try {
      // Fetch item with relations
      const item = await prisma.item.findUnique({
        where: { id: itemId, deletedAt: null },
        include: { condicao: true, sala: true },
      });

      if (!item) {
        return res
          .status(404)
          .json({ data: null, error: "Item não encontrado" });
      }

      // Validate status is "Emprestado"
      if (
        item.condicao.nome !== "Emprestado" &&
        item.condicao.nome !== "Em manutenção"
      ) {
        return res.status(400).json({
          data: null,
          error: `Apenas itens com status "Emprestado" ou "Em manutenção" podem ser devolvidos/restaurados. Status atual: ${item.condicao.nome}`,
        });
      }

      // Validate quantity
      ItemService.validateQuantityTransfer(item.quantidade, quantidade);

      // Validate new location exists
      if (!salaId) {
        return res.status(400).json({
          data: null,
          error: "Localização de devolução é obrigatória",
        });
      }

      const newSala = await prisma.sala.findUnique({
        where: { id: parseInt(salaId) },
      });

      if (!newSala) {
        return res.status(404).json({
          data: null,
          error: "Localização de devolução não encontrada",
        });
      }

      // Get "Disponível" condition ID
      const disponivel = await prisma.condicao.findFirst({
        where: { nome: "Disponível" },
      });

      if (!disponivel) {
        return res.status(500).json({
          data: null,
          error: 'Condição "Disponível" não configurada no sistema',
        });
      }

      // Create/update item at new location with returned quantity with "Disponível" status
      // If item with same (nome, serialNumber, salaId) exists, update its quantity
      // Otherwise, create a new item
      const returnedItem = await ItemService.upsertItemAtLocation(
        itemId,
        parseInt(salaId),
        disponivel.id,
        quantidade,
      );

      // Reduce original item quantity
      let updatedOriginal = await prisma.item.update({
        where: { id: itemId },
        data: { quantidade: item.quantidade - Number(quantidade) },
      });

      // If quantity reaches 0, consolidate into the returned item
      if (updatedOriginal.quantidade <= 0) {
        // Consolidate the original item into the returned item
        // This preserves the history while marking the original as consolidated
        updatedOriginal = await ItemService.consolidateItem(
          itemId,
          returnedItem.id,
        );

        // Create "consolidation" registo to document the merge event
        const consolidationRegisto = await RecordService.createRecord({
          instituicaoId: req.tenantId,
          itemId: returnedItem.id,
          quantidade: Number(quantidade),
          utilizadorId: req.userId,
          type: "consolidation",
          reason: `Consolidado do item anterior (${item.id})`,
        });
      }

      // Create registo record on original item for the return transaction
      const registo = await RecordService.createRecord({
        instituicaoId: req.tenantId,
        itemId: itemId,
        quantidade: Number(quantidade),
        utilizadorId: req.userId,
        type: transferType || "return",
        reason,
      });

      res.json({
        message: "Devolução registada com sucesso",
        data: {
          originalItem: updatedOriginal,
          returnedItem,
          registo,
          consolidatedInto: updatedOriginal.consolidatedIntoItemId
            ? returnedItem.id
            : null,
        },
        error: null,
      });
    } catch (error) {
      console.error("Error in return:", error);
      res.status(400).json({
        data: null,
        message: error.message || "Erro ao registar devolução",
        error: error.message,
      });
    }
  },
);

/**
 * POST /item/exit/:id
 * Register permanent removal from item (loss, disposal, etc)
 * Works with any status except deleted
 */
router.post(
  "/exit/:id",
  requirePermission(PERMISSIONS.ITEM_UPDATE),
  async (req, res) => {
    const { quantidade, reason } = req.body;
    const itemId = parseInt(req.params.id);

    try {
      // Fetch item
      const item = await prisma.item.findUnique({
        where: { id: itemId },
      });

      if (!item || item.deletedAt) {
        return res
          .status(404)
          .json({ data: null, error: "Item não encontrado" });
      }

      // Validate quantity
      if (
        !quantidade ||
        Number(quantidade) <= 0 ||
        Number(quantidade) > item.quantidade
      ) {
        return res.status(400).json({
          data: null,
          error:
            "Quantidade deve ser maior que 0 e não pode exceder a quantidade disponível",
        });
      }

      // Reduce quantity and auto soft-delete if reaches 0
      const updatedItem = await ItemService.reduceAndDeleteIfZero(
        itemId,
        quantidade,
      );

      // Create registo record
      const registo = await RecordService.createRecord({
        instituicaoId: req.tenantId,
        itemId: itemId,
        quantidade: Number(quantidade),
        utilizadorId: req.userId,
        type: "out",
        reason,
      });

      res.json({
        message: "Saída registada com sucesso",
        data: { item: updatedItem, registo },
        error: null,
      });
    } catch (error) {
      console.error("Error in exit:", error);
      res.status(400).json({
        data: null,
        message: error.message || "Erro ao registar saída",
        error: error.message,
      });
    }
  },
);

/**
 * POST /item/status-change/:id
 * Register status change and transfer items (borrow, repair, maintenance, restore)
 * If item exists at destination with same (nome, serialNumber, salaId), update its quantity
 * Otherwise, create a new item at destination location
 * Similar to return but for different movement types
 */
router.post(
  "/status-change/:id",
  requirePermission(PERMISSIONS.ITEM_UPDATE),
  async (req, res) => {
    const { quantidade, salaId, type, reason } = req.body;
    const itemId = parseInt(req.params.id);

    try {
      // Validate movement type
      const validTypes = [
        "borrow",
        "repair",
        "maintenance",
        "restore",
        "transfer",
      ];
      if (!type || !validTypes.includes(type)) {
        return res.status(400).json({
          data: null,
          error: `Tipo de movimento inválido. Tipos suportados: ${validTypes.join(
            ", ",
          )}`,
        });
      }

      // Fetch item with relations
      const item = await prisma.item.findUnique({
        where: { id: itemId, deletedAt: null },
        include: { condicao: true, sala: true },
      });

      if (!item) {
        return res
          .status(404)
          .json({ data: null, error: "Item não encontrado" });
      }

      // Validate quantity
      ItemService.validateQuantityTransfer(item.quantidade, quantidade);

      // Validate new location exists
      if (!salaId) {
        return res.status(400).json({
          data: null,
          error: "Localização de destino é obrigatória",
        });
      }

      const newSala = await prisma.sala.findUnique({
        where: { id: parseInt(salaId) },
      });

      if (!newSala) {
        return res.status(404).json({
          data: null,
          error: "Localização de destino não encontrada",
        });
      }

      // Map movement type to target condition
      // For status changes, we keep the current status or set appropriate one
      // "borrow" -> "Emprestado", "repair"/"maintenance" -> "Em manutenção", "restore" -> "Disponível"
      let targetCondicaoId = item.condicaoId;
      let targetConditionName = item.condicao.nome;

      if (type === "borrow") {
        const emprestado = await prisma.condicao.findFirst({
          where: { nome: "Emprestado" },
        });
        if (emprestado) {
          targetCondicaoId = emprestado.id;
          targetConditionName = "Emprestado";
        }
      } else if (type === "repair" || type === "maintenance") {
        const emManutencao = await prisma.condicao.findFirst({
          where: { nome: "Em manutenção" },
        });
        if (emManutencao) {
          targetCondicaoId = emManutencao.id;
          targetConditionName = "Em manutenção";
        }
      } else if (type === "restore") {
        const disponivel = await prisma.condicao.findFirst({
          where: { nome: "Disponível" },
        });
        if (disponivel) {
          targetCondicaoId = disponivel.id;
          targetConditionName = "Disponível";
        }
      }

      // Create/update item at new location with target status and quantity
      // If item with same (nome, serialNumber, salaId) exists, update its quantity
      // Otherwise, create a new item
      const statusChangeItem = await ItemService.upsertItemAtLocation(
        itemId,
        parseInt(salaId),
        targetCondicaoId,
        quantidade,
      );

      // Reduce original item quantity
      let updatedOriginal = await prisma.item.update({
        where: { id: itemId },
        data: { quantidade: item.quantidade - Number(quantidade) },
      });

      // If quantity reaches 0, consolidate into the status change item
      if (updatedOriginal.quantidade <= 0) {
        // Consolidate the original item into the status change item
        updatedOriginal = await ItemService.consolidateItem(
          itemId,
          statusChangeItem.id,
        );

        // Create "consolidation" registo to document the merge event
        await RecordService.createRecord({
          instituicaoId: req.tenantId,
          itemId: statusChangeItem.id,
          quantidade: Number(quantidade),
          utilizadorId: req.userId,
          type: "consolidation",
          reason: `Consolidado do item anterior (${item.id})`,
        });
      }

      // Create registo record on original item for the status change transaction
      const registo = await RecordService.createRecord({
        instituicaoId: req.tenantId,
        itemId: itemId,
        quantidade: Number(quantidade),
        utilizadorId: req.userId,
        type,
        reason,
      });

      res.json({
        message: "Mudança de status registada com sucesso",
        data: {
          originalItem: updatedOriginal,
          statusChangeItem,
          registo,
          consolidatedInto: updatedOriginal.consolidatedIntoItemId
            ? statusChangeItem.id
            : null,
        },
        error: null,
      });
    } catch (error) {
      console.error("Error in status change:", error);
      res.status(400).json({
        data: null,
        message: error.message || "Erro ao registar mudança de status",
        error: error.message,
      });
    }
  },
);

export default router;
