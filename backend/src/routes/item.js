import express from "express";
import prisma from "../lib/prisma.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const instituicaoId = parseInt(req.headers["x-instituicao-id"]);

  const itens = await prisma.item.findMany({
    where: {
      deletedAt: null,
      categoria: { instituicaoId },
    },
    include: {
      categoria: true,
      condicao: true,
      sala: true,
    },
  });

  res.json({ data: itens, error: null });
});
router.get("/:id", async (req, res) => {
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

  res.json({ data: item, error: null });
});

router.post("/create", async (req, res) => {
  const { nome, descricao, quantidade, categoriaId, condicaoId, salaId } =
    req.body;

  if (!nome || !categoriaId || !condicaoId || !salaId) {
    return res.status(400).json({ data: null, error: "Todos os campos são obrigatórios" });
  }

  const categoria = await prisma.categoria.findUnique({
    where: { id: categoriaId },
  });

  const condicao = await prisma.condicao.findUnique({
    where: { id: condicaoId },
  });

  const sala = await prisma.sala.findUnique({
    where: { id: salaId },
  });

  if (!categoria || !condicao || !sala) {
    return res.status(404).json({ data: null, error: "Um dos itens não foi encontrado" });
  }

  try {
    const newItem = await prisma.item.create({
      data: {
        nome,
        descricao: descricao || "",
        categoriaId,
        condicaoId,
        salaId,
        quantidade,
      },
    });

    res.status(201).json({ data: newItem, error: null });
  } catch (error) {
    res.status(500).json({ data: null, error: error.message });
  }
});

router.put("/update/:id", async (req, res) => {
  const {
    nome,
    descricao,
    quantidade,
    status,
    categoriaId,
    condicaoId,
    salaId,
  } = req.body;

  const item = await prisma.item.findUnique({
    where: { id: parseInt(req.params.id) },
  });

  if (!item || item.deletedAt) {
    return res.status(404).json({ data: null, error: "Item not found" });
  }

  const categoria = categoriaId
    ? await prisma.categoria.findUnique({
        where: { id: categoriaId },
      })
    : null;

  const condicao = condicaoId
    ? await prisma.condicao.findUnique({
        where: { id: condicaoId },
      })
    : null;

  const sala = salaId
    ? await prisma.sala.findUnique({
        where: { id: salaId },
      })
    : null;

  if (categoriaId && !categoria) {
    return res.status(404).json({ data: null, error: "Categoria não encontrada" });
  }
  if (condicaoId && !condicao) {
    return res.status(404).json({ data: null, error: "Condição não encontrada" });
  }
  if (salaId && !sala) {
    return res.status(404).json({ data: null, error: "Sala não encontrada" });
  }

  try {
    const newItem = await prisma.item.update({
      where: { id: item.id },
      data: {
        nome: nome || item.nome,
        descricao: descricao !== undefined ? descricao : item.descricao,
        categoriaId: categoriaId || item.categoriaId,
        condicaoId: condicaoId || item.condicaoId,
        salaId: salaId || item.salaId,
        quantidade: quantidade || item.quantidade,
        status: status || item.status,
      },
    });

    res.json({ data: newItem, error: null });
  } catch (error) {
    res.status(500).json({ data: null, error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
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

    res.json({ data: deletedItem, error: null });
  } catch (error) {
    res.status(500).json({ data: null, error: error.message });
  }
});

export default router;
