import express from "express";
import prisma from "../lib/prisma.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const instituicaoId = parseInt(req.headers["x-instituicao-id"]);

  const categorias = await prisma.categoria.findMany({
    where: { instituicaoId, deletedAt: null },
  });

  res.json({ data: categorias, error: null });
});

router.get("/:id", async (req, res) => {
  const instituicaoId = parseInt(req.headers["x-instituicao-id"]);

  const categoria = await prisma.categoria.findFirst({
    where: {
      id: parseInt(req.params.id),
      instituicaoId,
      deletedAt: null,
    },
  });

  if (!categoria) {
    return res.status(404).json({ data: null, error: "Categoria not found" });
  }

  res.json({ data: categoria, error: null });
});

router.post("/create", async (req, res) => {
  const instituicaoId = parseInt(req.headers["x-instituicao-id"]);
  const { nome, descricao } = req.body;

  if (!nome) {
    return res.status(400).json({ data: null, error: "Nome é obrigatório" });
  }

  try {
    const newCategoria = await prisma.categoria.create({
      data: {
        nome,
        descricao: descricao || "",
        instituicaoId,
      },
    });

    res.status(201).json({ data: newCategoria, error: null });
  } catch (error) {
    res.status(500).json({ data: null, error: error.message });
  }
});

router.put("/update/:id", async (req, res) => {
  const instituicaoId = parseInt(req.headers["x-instituicao-id"]);
  const { nome, descricao } = req.body;

  const categoria = await prisma.categoria.findFirst({
    where: {
      id: parseInt(req.params.id),
      instituicaoId,
      deletedAt: null,
    },
  });

  if (!categoria) {
    return res.status(404).json({ data: null, error: "Categoria not found" });
  }

  try {
    const updated = await prisma.categoria.update({
      where: { id: categoria.id },
      data: {
        nome: nome ?? categoria.nome,
        descricao: descricao ?? categoria.descricao,
      },
    });

    res.json({ data: updated, error: null });
  } catch (error) {
    res.status(500).json({ data: null, error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  const instituicaoId = parseInt(req.headers["x-instituicao-id"]);

  const categoria = await prisma.categoria.findFirst({
    where: {
      id: parseInt(req.params.id),
      instituicaoId,
      deletedAt: null,
    },
  });

  if (!categoria) {
    return res.status(404).json({ data: null, error: "Categoria not found" });
  }

  try {
    const deletedCategoria = await prisma.categoria.update({
      where: { id: categoria.id },
      data: { deletedAt: new Date() },
    });

    res.json({ data: deletedCategoria, error: null });
  } catch (error) {
    res.status(500).json({ data: null, error: error.message });
  }
});

export default router;
