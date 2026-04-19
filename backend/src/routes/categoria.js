import express from "express";
import prisma from "../lib/prisma.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const categorias = await prisma.categoria.findMany();

  res.json({ message: "Categoria routes are working!", data: categorias });
});

router.get("/:id", async (req, res) => {
  const categoria = await prisma.categoria.findUnique({
    where: { id: parseInt(req.params.id) },
  });

  if (!categoria) {
    return res.status(404).json({ error: "Categoria not found" });
  }

  res.json({ message: "", data: categoria });
});

router.post("/create", async (req, res) => {
  const { nome, descricao } = req.body;

  if (!nome) {
    return res.status(400).json({ error: "Nome é obrigatório" });
  }

  try {
    const newCategoria = await prisma.categoria.create({
      data: {
        nome: nome || "",
        descricao: descricao || "",
      },
    });

    res.status(201).json(newCategoria);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create categoria", error: error.message });
  }
});

router.put("/update/:id", async (req, res) => {
  const { nome, descricao } = req.body;

  const categoria = await prisma.categoria.findUnique({
    where: { id: parseInt(req.params.id) },
  });

  if (!categoria) {
    return res.status(404).json({ error: "Categoria not found" });
  }

  const nweCategoria = await prisma.categoria.update({
    where: { id: categoria.id },
    data: {
      nome: nome || categoria.nome,
      descricao: descricao || categoria.descricao,
    },
  });

  res.json({ message: "Categoria updated successfully", data: nweCategoria });
});

export default router;
