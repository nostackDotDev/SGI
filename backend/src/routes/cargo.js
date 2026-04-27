import express from "express";
import prisma from "../lib/prisma.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { tenantIsolation } from "../middlewares/tenantIsolation.middleware.js";
import { requirePermission } from "../middlewares/permissions.middleware.js";
import { PERMISSIONS } from "../constants/permissions.constants.js";

const router = express.Router();

router.use(authMiddleware);
router.use(tenantIsolation);
router.get("/", requirePermission(PERMISSIONS.CARGO_READ), async (req, res) => {
  const instituicaoId = req.tenantId;

  const cargos = await prisma.cargo.findMany({
    where: { instituicaoId, deletedAt: null },
    include: {
      permissoes: {
        include: { permissao: true },
      },
    },
  });

  const safeCargos = cargos.map((c) => ({
    id: c.id,
    nome: c.nome,
    descricao: c.descricao ?? "",
    permissoes: c.permissoes.map((cp) => cp.permissao.nome),
  }));

  res.json({ data: safeCargos, error: null });
});

router.get(
  "/:id",
  requirePermission(PERMISSIONS.CARGO_READ),
  async (req, res) => {
    const instituicaoId = req.tenantId;

    const cargo = await prisma.cargo.findFirst({
      where: {
        id: parseInt(req.params.id),
        instituicaoId,
        deletedAt: null,
      },
      include: {
        permissoes: {
          include: { permissao: true },
        },
      },
    });

    if (!cargo) {
      return res.status(404).json({ data: null, error: "Cargo not found" });
    }

    res.json({
      message: "Cargo encontrado",
      data: {
        id: cargo.id,
        nome: cargo.nome,
        descricao: cargo.descricao ?? "",
        createdAt: cargo.createdAt,
        permissoes: cargo.permissoes.map((cp) => cp.permissao.nome),
      },
      error: null,
    });
  },
);

router.post(
  "/create",
  requirePermission(PERMISSIONS.CARGO_CREATE),
  async (req, res) => {
    const instituicaoId = req.tenantId;
    const { nome, permissoes, descricao } = req.body;

    const permissionNames = Array.isArray(permissoes)
      ? [
          ...new Set(
            permissoes.map((name) => String(name).trim()).filter(Boolean),
          ),
        ]
      : [];

    if (!nome || !permissionNames.length) {
      return res.status(400).json({
        data: null,
        error: "Nome e permissões são obrigatórias",
      });
    }

    try {
      const foundPermissions = await prisma.permissao.findMany({
        where: { nome: { in: permissionNames } },
      });

      const foundNames = foundPermissions.map((permission) => permission.nome);
      const missingPermissions = permissionNames.filter(
        (permission) => !foundNames.includes(permission),
      );

      if (missingPermissions.length) {
        return res.status(400).json({
          data: null,
          error: `Permissão(s) inválida(s): ${missingPermissions.join(", ")}`,
        });
      }

      const newCargo = await prisma.cargo.create({
        data: {
          nome,
          descricao: descricao || "",
          instituicaoId,
          permissoes: {
            create: foundPermissions.map((permission) => ({
              permissao: {
                connect: { id: permission.id },
              },
            })),
          },
        },
      });

      res.status(201).json({ data: newCargo, error: null });
    } catch (error) {
      res.status(500).json({ data: null, error: error.message });
    }
  },
);

router.put(
  "/update/:id",
  requirePermission(PERMISSIONS.CARGO_UPDATE),
  async (req, res) => {
    const instituicaoId = req.tenantId;
    const { nome, descricao, permissoes } = req.body;

    if (!nome && !descricao && permissoes === undefined) {
      return res.status(400).json({
        message: "Nenhum campo para atualizar fornecido",
        data: null,
        error: "At least one field must be provided for update",
      });
    }

    const cargo = await prisma.cargo.findFirst({
      where: {
        id: parseInt(req.params.id),
        instituicaoId,
        deletedAt: null,
      },
    });

    if (!cargo) {
      return res.status(404).json({ data: null, error: "Cargo not found" });
    }

    try {
      if (permissoes !== undefined) {
        const permissionNames = Array.isArray(permissoes)
          ? [
              ...new Set(
                permissoes.map((name) => String(name).trim()).filter(Boolean),
              ),
            ]
          : [];

        const foundPermissions = await prisma.permissao.findMany({
          where: { nome: { in: permissionNames } },
        });

        const foundNames = foundPermissions.map(
          (permission) => permission.nome,
        );
        const missingPermissions = permissionNames.filter(
          (permission) => !foundNames.includes(permission),
        );

        if (missingPermissions.length) {
          return res.status(400).json({
            data: null,
            error: `Permissão(s) inválida(s): ${missingPermissions.join(", ")}`,
          });
        }

        const currentCargoPermissions = await prisma.cargoPermissao.findMany({
          where: { cargoId: cargo.id },
        });

        const permissionsToRemove = currentCargoPermissions.filter(
          (item) =>
            !foundPermissions.some(
              (permission) => permission.id === item.permissaoId,
            ),
        );

        const permissionsToAdd = foundPermissions.filter(
          (permission) =>
            !currentCargoPermissions.some(
              (current) => current.permissaoId === permission.id,
            ),
        );

        if (permissionsToRemove.length) {
          await prisma.cargoPermissao.deleteMany({
            where: {
              cargoId: cargo.id,
              permissaoId: {
                in: permissionsToRemove.map(
                  (permission) => permission.permissaoId,
                ),
              },
            },
          });
        }

        if (permissionsToAdd.length) {
          await prisma.cargoPermissao.createMany({
            data: permissionsToAdd.map((permission) => ({
              cargoId: cargo.id,
              permissaoId: permission.id,
            })),
            skipDuplicates: true,
          });
        }
      }

      const updated = await prisma.cargo.update({
        where: { id: cargo.id },
        data: {
          nome: nome ?? cargo.nome,
          descricao: descricao ?? cargo.descricao,
        },
      });

      res.json({ data: updated, error: null });
    } catch (error) {
      res.status(500).json({ data: null, error: error.message });
    }
  },
);

router.delete(
  "/:id",
  requirePermission(PERMISSIONS.CARGO_DELETE),
  async (req, res) => {
    const instituicaoId = req.tenantId;

    const cargo = await prisma.cargo.findFirst({
      where: {
        id: parseInt(req.params.id),
        instituicaoId,
        deletedAt: null,
      },
    });

    if (!cargo) {
      return res.status(404).json({ data: null, error: "Cargo not found" });
    }

    try {
      const deletedCargo = await prisma.cargo.update({
        where: { id: cargo.id },
        data: { deletedAt: new Date() },
      });

      res.json({ data: deletedCargo, error: null });
    } catch (error) {
      res.status(500).json({ data: null, error: error.message });
    }
  },
);

// -----------------------------
// PERMISSIONS MANAGEMENT
// -----------------------------

router.get(
  "/:id/permissions",
  requirePermission(PERMISSIONS.CARGO_READ),
  async (req, res) => {
    const cargoId = parseInt(req.params.id);

    try {
      const cargo = await prisma.cargo.findUnique({
        where: { id: cargoId },
        include: {
          permissoes: {
            include: { permissao: true },
          },
        },
      });

      if (!cargo) {
        return res.status(404).json({
          message: "Cargo não encontrado",
          data: null,
          error: "Cargo not found",
        });
      }

      const permissions = cargo.permissoes.map((cp) => cp.permissao.nome);

      res.json({
        message: "Permissões do cargo obtidas com sucesso",
        data: permissions,
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
  requirePermission(PERMISSIONS.CARGO_UPDATE),
  async (req, res) => {
    const cargoId = parseInt(req.params.id);
    const { permissaoNome } = req.body;

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

      const cargoPermissao = await prisma.cargoPermissao.upsert({
        where: {
          cargoId_permissaoId: {
            cargoId,
            permissaoId: permissao.id,
          },
        },
        update: {},
        create: {
          cargoId,
          permissaoId: permissao.id,
        },
      });

      res.status(201).json({
        message: "Permissão adicionada ao cargo com sucesso",
        data: cargoPermissao,
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
  requirePermission(PERMISSIONS.CARGO_UPDATE),
  async (req, res) => {
    const cargoId = parseInt(req.params.id);
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

      await prisma.cargoPermissao.delete({
        where: {
          cargoId_permissaoId: {
            cargoId,
            permissaoId: permissao.id,
          },
        },
      });

      res.json({
        message: "Permissão removida do cargo com sucesso",
        data: null,
        error: null,
      });
    } catch (error) {
      if (error.code === "P2025") {
        return res.status(404).json({
          message: "Permissão não atribuída ao cargo",
          data: null,
          error: "Permission not assigned to cargo",
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
  requirePermission(PERMISSIONS.CARGO_UPDATE),
  async (req, res) => {
    const cargoId = parseInt(req.params.id);
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

      // Check if cargo already has this permission
      const existing = await prisma.cargoPermissao.findUnique({
        where: {
          cargoId_permissaoId: {
            cargoId,
            permissaoId: permissao.id,
          },
        },
      });

      if (existing) {
        // Remove the permission
        await prisma.cargoPermissao.delete({
          where: {
            cargoId_permissaoId: {
              cargoId,
              permissaoId: permissao.id,
            },
          },
        });
        res.json({
          message: "Permissão removida do cargo",
          data: null,
          error: null,
        });
      } else {
        // Add the permission
        const cargoPermissao = await prisma.cargoPermissao.create({
          data: {
            cargoId,
            permissaoId: permissao.id,
          },
        });
        res.status(201).json({
          message: "Permissão adicionada ao cargo",
          data: cargoPermissao,
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
