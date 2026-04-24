import express from "express";
import prisma from "../lib/prisma.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const instituicaoId = parseInt(req.headers["x-instituicao-id"]);

  const utilizadores = await prisma.utilizador.findMany({
    where: { instituicaoId, deletedAt: null },
    include: { cargo: true, instituicao: true, registos: true },
  });

  res.json({ data: utilizadores, error: null });
});

router.get("/:id", async (req, res) => {
  const instituicaoId = parseInt(req.headers["x-instituicao-id"]);

  const utilizador = await prisma.utilizador.findFirst({
    where: {
      id: parseInt(req.params.id),
      instituicaoId,
      deletedAt: null,
    },
    include: { cargo: true, instituicao: true, registos: true },
  });

  if (!utilizador) {
    return res.status(404).json({ data: null, error: "Utilizador not found" });
  }

  res.json({ data: utilizador, error: null });
});

router.post("/create", async (req, res) => {
  const instituicaoId = parseInt(req.headers["x-instituicao-id"]);
  const { nome, email, password, cargoId, descricao } = req.body;

  if (!nome || !email || !password || !cargoId) {
    return res.status(400).json({ data: null, error: "Campos obrigatórios faltando" });
  }

  const cargo = await prisma.cargo.findFirst({
    where: { id: cargoId, instituicaoId },
  });

  if (!cargo) {
    return res.status(404).json({ data: null, error: "Cargo not found" });
  }

  try {
    const newUtilizador = await prisma.utilizador.create({
      data: {
        nome,
        email,
        password,
        cargoId,
        instituicaoId,
        descricao: descricao || "",
      },
    });

    res.status(201).json({ data: newUtilizador, error: null });
  } catch (error) {
    res.status(500).json({ data: null, error: error.message });
  }
});

router.put("/update/:id", async (req, res) => {
  const instituicaoId = parseInt(req.headers["x-instituicao-id"]);
  const { nome, email, password, cargoId, descricao } = req.body;

  const utilizador = await prisma.utilizador.findFirst({
    where: {
      id: parseInt(req.params.id),
      instituicaoId,
      deletedAt: null,
    },
  });

  if (!utilizador) {
    return res.status(404).json({ data: null, error: "Utilizador not found" });
  }

  const cargo = cargoId
    ? await prisma.cargo.findFirst({
        where: { id: cargoId, instituicaoId },
      })
    : null;

  if (cargoId && !cargo) {
    return res.status(404).json({ data: null, error: "Cargo not found" });
  }

  try {
    const updated = await prisma.utilizador.update({
      where: { id: utilizador.id },
      data: {
        nome: nome ?? utilizador.nome,
        email: email ?? utilizador.email,
        password: password ?? utilizador.password,
        cargoId: cargoId ?? utilizador.cargoId,
        descricao: descricao ?? utilizador.descricao,
      },
    });

    res.json({ data: updated, error: null });
  } catch (error) {
    res.status(500).json({ data: null, error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  const instituicaoId = parseInt(req.headers["x-instituicao-id"]);

  const utilizador = await prisma.utilizador.findFirst({
    where: {
      id: parseInt(req.params.id),
      instituicaoId,
      deletedAt: null,
    },
  });

  if (!utilizador) {
    return res.status(404).json({ data: null, error: "Utilizador not found" });
  }

  try {
    const deletedUtilizador = await prisma.utilizador.update({
      where: { id: utilizador.id },
      data: { deletedAt: new Date() },
    });

    res.json({ data: deletedUtilizador, error: null });
  } catch (error) {
    res.status(500).json({ data: null, error: error.message });
  }
});

export default router;
