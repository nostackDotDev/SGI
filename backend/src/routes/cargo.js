import express from "express";
import prisma from "../lib/prisma.js";

const router = express.Router();
router.get("/", async (req, res) => {
  const instituicaoId = parseInt(req.headers["x-instituicao-id"]);

  const cargos = await prisma.cargo.findMany({
    where: { instituicaoId, deletedAt: null },
  });

  res.json({ data: cargos, error: null });
});

router.get("/:id", async (req, res) => {
  const instituicaoId = parseInt(req.headers["x-instituicao-id"]);

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

  res.json({ data: cargo, error: null });
});

router.post("/create", async (req, res) => {
  const instituicaoId = parseInt(req.headers["x-instituicao-id"]);
  const { nome, permissoes, descricao } = req.body;

  if (!nome || !permissoes) {
    return res.status(400).json({ data: null, error: "Nome e permissões são obrigatórias" });
  }

  try {
    const newCargo = await prisma.cargo.create({
      data: {
        nome,
        descricao: descricao || "",
        permissoes,
        instituicaoId,
      },
    });

    res.status(201).json({ data: newCargo, error: null });
  } catch (error) {
    res.status(500).json({ data: null, error: error.message });
  }
});

router.put("/update/:id", async (req, res) => {
  const instituicaoId = parseInt(req.headers["x-instituicao-id"]);
  const { nome, permissoes, descricao } = req.body;

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
    const updated = await prisma.cargo.update({
      where: { id: cargo.id },
      data: {
        nome: nome ?? cargo.nome,
        descricao: descricao ?? cargo.descricao,
        permissoes: permissoes ?? cargo.permissoes,
      },
    });

    res.json({ data: updated, error: null });
  } catch (error) {
    res.status(500).json({ data: null, error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  const instituicaoId = parseInt(req.headers["x-instituicao-id"]);

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
});

export default router;
