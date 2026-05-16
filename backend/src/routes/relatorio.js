import express from "express";
import prisma from "../lib/prisma.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requirePermission } from "../middlewares/permissions.middleware.js";
import { tenantIsolation } from "../middlewares/tenantIsolation.middleware.js";
import { PERMISSIONS } from "../constants/permissions.constants.js";
import { parseDateRange } from "../lib/utils.js";

const router = express.Router();

router.use(authMiddleware);
router.use(tenantIsolation);

const REPORT_TYPES = {
  INVENTORY_SUMMARY: "inventory_summary",
};

const CONDITION_NAME_MAP = {
  available: "Disponível",
  borrowed: "Emprestado",
  repair: "Em manutenção",
};

function formatRegistoResponse(registo) {
  return {
    id: registo.id,
    type: registo.type,
    date: registo.createdAt,
    reason: registo.reason,
    quantidade: registo.quantidade,
    item: registo.item
      ? {
          id: registo.item.id,
          nome: registo.item.nome,
        }
      : null,
    utilizador: registo.utilizador
      ? {
          id: registo.utilizador.id,
          nome: registo.utilizador.nome,
        }
      : null,
  };
}

function getConditionKey(conditionName) {
  if (conditionName === CONDITION_NAME_MAP.available) return "available";
  if (conditionName === CONDITION_NAME_MAP.borrowed) return "borrowed";
  if (conditionName === CONDITION_NAME_MAP.repair) return "repair";
  return null;
}

async function buildReport({ type, startDate, endDate, tenantId }) {
  if (type !== REPORT_TYPES.INVENTORY_SUMMARY) {
    throw new Error(`Unsupported report type: ${type}`);
  }

  // Parse and validate date range
  const {
    startDate: parsedStart,
    endDate: parsedEnd,
    isInvalid,
  } = parseDateRange(startDate, endDate);

  // If date range is invalid, return empty array
  if (isInvalid) {
    return res.json({
      message: "Período inválido",
      data: [],
      error: "Invalid date range",
    });
  }

  /* 
const items = await prisma.item.findMany({
    where: {
      registos: {
        every: {
          createdAt: {
        gte: startDate,
        lte: endDate,
      },
        }
      }
    }
  })
*/

  // Get all registos in the date range with all related data
  const registos = await prisma.registo.findMany({
    where: {
      deletedAt: null,
      utilizador: {
        instituicaoId: tenantId,
      },
      createdAt: {
        gte: parsedStart,
        lte: parsedEnd,
      },
    },
    include: {
      item: {
        include: {
          categoria: true,
          condicao: true,
        },
      },
      utilizador: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Build categories summary directly from records
  // Group items by category from records
  const itemsByCategory = {};

  for (const registo of registos) {
    if (!registo.item || registo.item.deletedAt) continue;

    const categoria = registo.item.categoria;
    if (!categoria) continue;

    const categoryKey = categoria.id;

    if (!itemsByCategory[categoryKey]) {
      itemsByCategory[categoryKey] = {
        id: categoria.id,
        nome: categoria.nome,
        descricao: categoria.descricao,
        items: {},
      };
    }

    const itemKey = registo.item.id;
    if (!itemsByCategory[categoryKey].items[itemKey]) {
      itemsByCategory[categoryKey].items[itemKey] = {
        id: registo.item.id,
        quantidade: registo.item.quantidade || 0,
        condicaoNome: registo.item.condicao?.nome,
      };
    }
  }

  const categorySummaries = Object.values(itemsByCategory).map((category) => {
    const summary = {
      id: category.id,
      nome: category.nome,
      descricao: category.descricao,
      total: 0,
      available: 0,
      borrowed: 0,
      repair: 0,
    };

    for (const item of Object.values(category.items)) {
      const amount = item.quantidade || 0;
      summary.total += amount;
      const key = getConditionKey(item.condicaoNome);
      if (key) {
        summary[key] += amount;
      }
    }

    return summary;
  });

  const totals = categorySummaries.reduce(
    (acc, category) => {
      acc.total += category.total;
      acc.available += category.available;
      acc.borrowed += category.borrowed;
      acc.repair += category.repair;
      return acc;
    },
    {
      total: 0,
      available: 0,
      borrowed: 0,
      repair: 0,
    },
  );

  return {
    categories: categorySummaries,
    totals,
    records: registos.map(formatRegistoResponse),
  };
}

router.get(
  "/:id",
  requirePermission(PERMISSIONS.RELATORIO_READ),
  async (req, res) => {
    const reportId = parseInt(req.params.id);

    if (Number.isNaN(reportId)) {
      return res.status(400).json({
        data: null,
        error: "ID de relatório inválido",
      });
    }

    const report = await prisma.relatorio.findUnique({
      where: { id: reportId },
    });

    if (!report || report.utilizadorId !== req.userId) {
      return res
        .status(404)
        .json({ data: null, error: "Relatório não encontrado" });
    }

    try {
      return res.json({
        data: {
          id: report.id,
          type: report.type,
          generatedAt: report.createdAt,
          startDate: report.startDate,
          endDate: report.endDate,
          categories: JSON.parse(report.categories),
          totals: JSON.parse(report.totals),
          records: JSON.parse(report.records),
        },
        error: null,
      });
    } catch (error) {
      return res.status(500).json({ data: null, error: error.message });
    }
  },
);

router.get(
  "/",
  requirePermission(PERMISSIONS.RELATORIO_READ),
  async (req, res) => {
    const reports = await prisma.relatorio.findMany({
      where: { utilizadorId: req.userId },
    });

    if (!reports || reports.length === 0) {
      return res
        .status(404)
        .json({ data: null, error: "Relatório não encontrado" });
    }

    try {
      return res.json(
        reports.map((report) => ({
          data: {
            id: report.id,
            type: report.type,
            generatedAt: report.createdAt,
            startDate: report.startDate,
            endDate: report.endDate,
            categories: JSON.parse(report.categories),
            totals: JSON.parse(report.totals),
            records: JSON.parse(report.records),
          },
          error: null,
        })),
      );
    } catch (error) {
      return res.status(500).json({ data: null, error: error.message });
    }
  },
);

router.post(
  "/create",
  requirePermission(PERMISSIONS.RELATORIO_CREATE),
  async (req, res) => {
    const { type, startDate, endDate } = req.body;

    if (!type) {
      return res.status(400).json({
        data: null,
        error: "O tipo de relatório é obrigatório",
      });
    }

    const {
      startDate: parsedStart,
      endDate: parsedEnd,
      isInvalid,
    } = parseDateRange(startDate, endDate);

    if (isInvalid) {
      return res.status(400).json({
        data: null,
        error: "Intervalo de datas inválido",
      });
    }

    try {
      const reportPayload = await buildReport({
        type,
        startDate: parsedStart,
        endDate: parsedEnd,
        tenantId: req.tenantId,
      });

      const savedReport = await prisma.relatorio.create({
        data: {
          type,
          startDate: parsedStart,
          endDate: parsedEnd,
          utilizadorId: req.userId,
          categories: JSON.stringify(reportPayload.categories),
          totals: JSON.stringify(reportPayload.totals),
          records: JSON.stringify(reportPayload.records),
        },
      });

      return res.status(201).json({
        data: {
          id: savedReport.id,
          type: savedReport.type,
          generatedAt: savedReport.createdAt,
          startDate: savedReport.startDate,
          endDate: savedReport.endDate,
          ...reportPayload,
        },
        error: null,
      });
    } catch (error) {
      return res.status(500).json({ data: null, error: error.message });
    }
  },
);

export default router;
