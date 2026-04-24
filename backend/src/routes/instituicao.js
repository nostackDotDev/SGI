import express from "express";
import prisma from "../lib/prisma.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const instituicoes = await prisma.instituicao.findMany({
    where: { deletedAt: null },
    include: { departamentos: true, cargos: true, utilizadores: true, categorias: true },
  });

  res.json({ data: instituicoes, error: null });
});

router.get("/:id", async (req, res) => {
  const instituicao = await prisma.instituicao.findUnique({
    where: { id: parseInt(req.params.id) },
    include: { departamentos: true, cargos: true, utilizadores: true, categorias: true },
  });

  if (!instituicao || instituicao.deletedAt) {
    return res.status(404).json({ data: null, error: "Instituição not found" });
  }

  res.json({ data: instituicao, error: null });
});

router.post("/create", async (req, res) => {
  const { nome, descricao, endereco, status } = req.body;

  if (!nome) {
    return res.status(400).json({ data: null, error: "Nome é obrigatório" });
  }

  try {
    const newInstituicao = await prisma.instituicao.create({
      data: {
        nome,
        descricao: descricao || "",
        endereco: endereco || "",
      },
    });

    res.status(201).json({ data: newInstituicao, error: null });
  } catch (error) {
    res.status(500).json({ data: null, error: error.message });
  }
});

router.put("/update/:id", async (req, res) => {
  const { nome, descricao, endereco, status } = req.body;

  const instituicao = await prisma.instituicao.findUnique({
    where: { id: parseInt(req.params.id) },
  });

  if (!instituicao || instituicao.deletedAt) {
    return res.status(404).json({ data: null, error: "Instituição not found" });
  }

  try {
    const newInstituicao = await prisma.instituicao.update({
      where: { id: instituicao.id },
      data: {
        nome: nome || instituicao.nome,
        descricao: descricao || instituicao.descricao,
        endereco: endereco || instituicao.endereco,
        status: status || instituicao.status,
      },
    });

    res.json({ data: newInstituicao, error: null });
  } catch (error) {
    res.status(500).json({ data: null, error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  const instituicao = await prisma.instituicao.findUnique({
    where: { id: parseInt(req.params.id) },
  });

  if (!instituicao || instituicao.deletedAt) {
    return res.status(404).json({ data: null, error: "Instituição not found" });
  }

  try {
    const deletedInstituicao = await prisma.instituicao.update({
      where: { id: instituicao.id },
      data: { deletedAt: new Date() },
    });

    res.json({ data: deletedInstituicao, error: null });
  } catch (error) {
    res.status(500).json({ data: null, error: error.message });
  }
});

export default router;
