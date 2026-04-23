import express from "express";
import prisma from "../lib/prisma.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const condicoes = await prisma.condicao.findMany({
    where: { deletedAt: null },
    include: { itens: true },
  });

  res.json({ data: condicoes, error: null });
});

router.get("/:id", async (req, res) => {
  const condicao = await prisma.condicao.findFirst({
    where: {
      id: parseInt(req.params.id),
      deletedAt: null,
    },
    include: { itens: true },
  });

  if (!condicao) {
    return res.status(404).json({ data: null, error: "Condicao not found" });
  }

  res.json({ data: condicao, error: null });
});

router.post("/create", async (req, res) => {
  const { nome, descricao } = req.body;

  if (!nome) {
    return res.status(400).json({ data: null, error: "Nome é obrigatório" });
  }

  try {
    const newCondicao = await prisma.condicao.create({
      data: {
        nome,
        descricao: descricao || "",
      },
    });

    res.status(201).json({ data: newCondicao, error: null });
  } catch (error) {
    res.status(500).json({ data: null, error: error.message });
  }
});

router.put("/update/:id", async (req, res) => {
  const { nome, descricao } = req.body;

  const condicao = await prisma.condicao.findFirst({
    where: {
      id: parseInt(req.params.id),
      deletedAt: null,
    },
  });

  if (!condicao) {
    return res.status(404).json({ data: null, error: "Condicao not found" });
  }

  try {
    const updated = await prisma.condicao.update({
      where: { id: condicao.id },
      data: {
        nome: nome ?? condicao.nome,
        descricao: descricao ?? condicao.descricao,
      },
    });

    res.json({ data: updated, error: null });
  } catch (error) {
    res.status(500).json({ data: null, error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  const condicao = await prisma.condicao.findFirst({
    where: {
      id: parseInt(req.params.id),
      deletedAt: null,
    },
  });

  if (!condicao) {
    return res.status(404).json({ data: null, error: "Condicao not found" });
  }

  try {
    const deletedCondicao = await prisma.condicao.update({
      where: { id: condicao.id },
      data: { deletedAt: new Date() },
    });

    res.json({ data: deletedCondicao, error: null });
  } catch (error) {
    res.status(500).json({ data: null, error: error.message });
  }
});

export default router;
