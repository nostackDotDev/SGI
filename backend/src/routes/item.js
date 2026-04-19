import express from "express";
import prisma from "../lib/prisma.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const itens = await prisma.item.findMany();

  res.json({
    message: "Item routes are working!",
    data: itens,
  });
});

router.get("/:id", async (req, res) => {
  const item = await prisma.item.findUnique({
    where: { id: parseInt(req.params.id) },
  });

  if (!item) {
    return res.status(404).json({ error: "Item not found", data: null });
  }

  res.json({ message: "", data: item });
});

router.post("/create", async (req, res) => {
  const { nome, descricao, quantidade, categoriaId, condicaoId, salaId } =
    req.body;

  if (!nome || !categoriaId || !condicaoId || !salaId) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  const categoria = await prisma.categoria.findUnique({
    where: { id: categoriaId },
  });

  const condicao = await prisma.condicao.findUnique({
    where: { id: categoriaId },
  });

  const sala = await prisma.sala.findUnique({
    where: { id: salaId },
  });

  if (!categoria || !condicao || !sala) {
    return res.status(404).json({ error: "Um dos itens não foi encontrado" });
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

    res.status(201).json(newItem);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create item", error: error.message });
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
    : salaId;

  if (categoriaId && !categoria) {
    return res.status(404).json({ error: "Categoria não encontrada" });
  }
  if (condicaoId && !condicao) {
    return res.status(404).json({ error: "Condição não encontrada" });
  }
  if (salaId && !sala) {
    return res.status(404).json({ error: "Sala não encontrada" });
  }

  try {
    const newItem = await prisma.item.update({
      where: { id: item.id },
      data: {
        id: item.id,
        nome: nome || item.nome,
        descricao: descricao || "",
        categoriaId: categoriaId || item.categoriaId,
        condicaoId: condicaoId || item.condicaoId,
        salaId: salaId || item.salaId,
        quantidade: quantidade || item.quantidade,
        status: status || item.status,
      },
    });

    res.status(201).json(newItem);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create item", error: error.message });
  }
});

export default router;
