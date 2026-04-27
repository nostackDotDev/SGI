import express from "express";
import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { tenantIsolation } from "../middlewares/tenantIsolation.middleware.js";
import { requirePermission } from "../middlewares/permissions.middleware.js";
import { PERMISSIONS } from "../constants/permissions.constants.js";
import { getUserPermissions } from "../services/permissions.service.js";
const router = express.Router();

/**
 * Helper function to sanitize user response (exclude password)
 */
const sanitizeUtilizador = (user) => ({
  id: user.id,
  nome: user.nome,
  email: user.email,
  descricao: user.descricao ?? "",
  cargoId: user.cargoId,
  instituicaoId: user.instituicaoId,
  updatedAt: user.updatedAt,
  createdAt: user.createdAt,
});

router.use(authMiddleware);
router.use(tenantIsolation);

router.get("/", requirePermission(PERMISSIONS.USER_READ), async (req, res) => {
  const instituicaoId = req.tenantId;

  const utilizadores = await prisma.utilizador.findMany({
    where: { instituicaoId, deletedAt: null },
    include: { cargo: true, instituicao: true, registos: true },
  });

  if (!utilizadores || utilizadores.length === 0) {
    return res.status(404).json({
      message: "Nenhum utilizador encontrado",
      data: null,
      error: "Nenhum utilizador encontrado",
    });
  }

  const safeUtilizadores = await Promise.all(
    utilizadores.map(async (u) => {
      const safeUser = sanitizeUtilizador(u);
      return {
        ...safeUser,
        instituicao: u.instituicao.nome,
        cargo: u.cargo.nome,
        permissions: Array.from(await getUserPermissions(u.id)),
      };
    }),
  );

  res.json({
    message: "Utilizadores encontrados",
    data: safeUtilizadores,
    error: null,
  });
});

router.get(
  "/:id",
  requirePermission(PERMISSIONS.USER_READ),
  async (req, res) => {
    const instituicaoId = req.tenantId;

    const utilizador = await prisma.utilizador.findFirst({
      where: {
        id: parseInt(req.params.id),
        instituicaoId,
        deletedAt: null,
      },
      include: { cargo: true, instituicao: true, registos: true },
    });

    if (!utilizador) {
      return res.status(404).json({
        message: "Utilizador não encontrado",
        data: null,
        error: "Utilizador not found",
      });
    }

    const permissions = await getUserPermissions(utilizador.id);
    const safeUser = sanitizeUtilizador(utilizador);

    res.json({
      message: "Utilizador encontrado",
      data: {
        ...safeUser,
        instituicao: utilizador.instituicao.nome,
        cargo: utilizador.cargo.nome,
        permissions: Array.from(permissions),
      },
      error: null,
    });
  },
);

router.post(
  "/create",
  requirePermission(PERMISSIONS.USER_CREATE),
  async (req, res) => {
    const instituicaoId = req.tenantId;
    const { nome, email, password, cargoId, descricao } = req.body;

    if (!nome || !email || !password || !cargoId) {
      return res
        .status(400)
        .json({ data: null, error: "Campos obrigatórios faltando" });
    }

    const cargo = await prisma.cargo.findFirst({
      where: { id: parseInt(cargoId), instituicaoId },
    });

    if (!cargo) {
      return res.status(404).json({ data: null, error: "Cargo not found" });
    }

    try {
      // Hash password before storing
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUtilizador = await prisma.utilizador.create({
        data: {
          nome,
          email,
          password: hashedPassword,
          cargoId: parseInt(cargoId),
          instituicaoId,
          descricao: descricao || "",
        },
      });

      res.status(201).json({
        message: "Utilizador criado com sucesso",
        data: sanitizeUtilizador(newUtilizador),
        error: null,
      });
    } catch (error) {
      res.status(500).json({
        message: "Erro ao criar utilizador",
        data: null,
        error: error.message,
      });
    }
  },
);

router.put(
  "/update/:id",
  requirePermission(PERMISSIONS.USER_UPDATE),
  async (req, res) => {
    const instituicaoId = req.tenantId;
    const { nome, email, password, cargoId, descricao } = req.body;

    if (!nome && !email && !password && !cargoId && !descricao) {
      return res.status(400).json({
        message: "Nenhum campo para atualizar fornecido",
        data: null,
        error: "At least one field must be provided for update",
      });
    }

    const utilizador = await prisma.utilizador.findFirst({
      where: {
        id: parseInt(req.params.id),
        instituicaoId,
        deletedAt: null,
      },
    });

    if (!utilizador) {
      return res.status(404).json({
        message: "Utilizador não encontrado",
        data: null,
        error: "Utilizador not found",
      });
    }

    const cargo = cargoId
      ? await prisma.cargo.findFirst({
          where: { id: parseInt(cargoId), instituicaoId },
        })
      : null;

    if (cargoId && !cargo) {
      return res.status(404).json({
        message: "Cargo não encontrado",
        data: null,
        error: "Cargo not found",
      });
    }

    try {
      // Build update data object, only including provided fields
      const updateData = {};

      if (nome) updateData.nome = nome;
      if (email) updateData.email = email;
      if (cargoId) updateData.cargoId = parseInt(cargoId);
      if (descricao) updateData.descricao = descricao;

      // Hash password if provided
      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }

      const updated = await prisma.utilizador.update({
        where: { id: utilizador.id },
        data: updateData,
      });

      res.json({
        message: "Utilizador atualizado com sucesso",
        data: sanitizeUtilizador(updated),
        error: null,
      });
    } catch (error) {
      res.status(500).json({
        message: "Erro ao atualizar utilizador",
        data: null,
        error: error.message,
      });
    }
  },
);

router.delete(
  "/delete/:id",
  requirePermission(PERMISSIONS.USER_DELETE),
  async (req, res) => {
    const instituicaoId = req.tenantId;

    const utilizador = await prisma.utilizador.findFirst({
      where: {
        id: parseInt(req.params.id),
        instituicaoId,
        deletedAt: null,
      },
    });

    if (!utilizador) {
      return res.status(404).json({
        message: "Utilizador não encontrado",
        data: null,
        error: "Utilizador not found",
      });
    }

    try {
      const deletedUtilizador = await prisma.utilizador.update({
        where: { id: utilizador.id },
        data: { deletedAt: new Date() },
      });

      res.json({
        message: "Utilizador eliminado com sucesso",
        data: sanitizeUtilizador(deletedUtilizador),
        error: null,
      });
    } catch (error) {
      res.status(500).json({
        message: "Erro ao eliminar utilizador",
        data: null,
        error: error.message,
      });
    }
  },
);

// -----------------------------
// PERMISSIONS MANAGEMENT
// -----------------------------

router.get(
  "/:id/permissions",
  requirePermission(PERMISSIONS.USER_READ),
  async (req, res) => {
    const utilizadorId = parseInt(req.params.id);

    try {
      const permissions = await getUserPermissions(utilizadorId);

      res.json({
        message: "Permissões do utilizador obtidas com sucesso",
        data: Array.from(permissions),
        error: null,
      });
    } catch (error) {
      res.status(500).json({
        message: "Erro ao obter permissões",
        data: null,
        error: error.message,
      });
    }
  },
);

router.post(
  "/:id/permissions",
  requirePermission(PERMISSIONS.USER_UPDATE),
  async (req, res) => {
    const utilizadorId = parseInt(req.params.id);
    const { permissaoNome, permitido = true } = req.body;

    if (!permissaoNome) {
      return res.status(400).json({
        message: "Nome da permissão é obrigatório",
        data: null,
        error: "permissaoNome is required",
      });
    }

    try {
      const permissao = await prisma.permissao.findUnique({
        where: { nome: permissaoNome },
      });

      if (!permissao) {
        return res.status(404).json({
          message: "Permissão não encontrada",
          data: null,
          error: "Permission not found",
        });
      }

      const utilizadorPermissao = await prisma.utilizadorPermissao.upsert({
        where: {
          utilizadorId_permissaoId: {
            utilizadorId,
            permissaoId: permissao.id,
          },
        },
        update: { permitido },
        create: {
          utilizadorId,
          permissaoId: permissao.id,
          permitido,
        },
      });

      res.status(201).json({
        message: "Permissão adicionada/atualizada com sucesso",
        data: utilizadorPermissao,
        error: null,
      });
    } catch (error) {
      res.status(500).json({
        message: "Erro ao adicionar permissão",
        data: null,
        error: error.message,
      });
    }
  },
);

router.delete(
  "/:id/permissions/:permissaoNome",
  requirePermission(PERMISSIONS.USER_UPDATE),
  async (req, res) => {
    const utilizadorId = parseInt(req.params.id);
    const permissaoNome = req.params.permissaoNome;

    try {
      const permissao = await prisma.permissao.findUnique({
        where: { nome: permissaoNome },
      });

      if (!permissao) {
        return res.status(404).json({
          message: "Permissão não encontrada",
          data: null,
          error: "Permission not found",
        });
      }

      await prisma.utilizadorPermissao.delete({
        where: {
          utilizadorId_permissaoId: {
            utilizadorId,
            permissaoId: permissao.id,
          },
        },
      });

      res.json({
        message: "Permissão removida com sucesso",
        data: null,
        error: null,
      });
    } catch (error) {
      if (error.code === "P2025") {
        return res.status(404).json({
          message: "Permissão não atribuída ao utilizador",
          data: null,
          error: "Permission not assigned to user",
        });
      }
      res.status(500).json({
        message: "Erro ao remover permissão",
        data: null,
        error: error.message,
      });
    }
  },
);

router.put(
  "/:id/permissions/:permissaoNome",
  requirePermission(PERMISSIONS.USER_UPDATE),
  async (req, res) => {
    const utilizadorId = parseInt(req.params.id);
    const permissaoNome = req.params.permissaoNome;

    try {
      const permissao = await prisma.permissao.findUnique({
        where: { nome: permissaoNome },
      });

      if (!permissao) {
        return res.status(404).json({
          message: "Permissão não encontrada",
          data: null,
          error: "Permission not found",
        });
      }

      // Check if user already has this permission via override
      const existingOverride = await prisma.utilizadorPermissao.findUnique({
        where: {
          utilizadorId_permissaoId: {
            utilizadorId,
            permissaoId: permissao.id,
          },
        },
      });

      if (existingOverride) {
        // Remove the override (permission denied)
        await prisma.utilizadorPermissao.delete({
          where: {
            utilizadorId_permissaoId: {
              utilizadorId,
              permissaoId: permissao.id,
            },
          },
        });
        res.json({
          message: "Permissão removida do utilizador (override negado)",
          data: null,
          error: null,
        });
      } else {
        // Add the override (permission granted)
        const utilizadorPermissao = await prisma.utilizadorPermissao.create({
          data: {
            utilizadorId,
            permissaoId: permissao.id,
          },
        });
        res.status(201).json({
          message: "Permissão adicionada ao utilizador (override concedido)",
          data: utilizadorPermissao,
          error: null,
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "Erro ao atualizar permissão",
        data: null,
        error: error.message,
      });
    }
  },
);

export default router;
