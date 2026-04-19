import express from "express";
import prisma from "../lib/prisma.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const instituicoes = await prisma.instituicao.findMany();

  res.json({
    message: "Instituição routes are working!",
    data: instituicoes,
  });
});

router.get("/:id", async (req, res) => {
  const instituicao = await prisma.instituicao.findUnique({
    where: { id: parseInt(req.params.id) },
  });

  if (!instituicao) {
    return res.status(404).json({ error: "Instituição not found", data: null });
  }

  res.json({ message: "", data: instituicao });
});

router.post("/create", async (req, res) => {
  const { nome, descricao, endereco, status } = req.body;

  if (!nome) {
    return res.status(400).json({ error: "Nome é obrigatório" });
  }

  try {
    const newInstituicao = await prisma.instituicao.create({
      data: {
        nome,
        descricao: descricao || "",
        endereco: endereco || "",
      },
    });

    res.status(201).json(newInstituicao);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create instituicao", error: error.message });
  }
});

router.put("/update/:id", async (req, res) => {
  const { nome, descricao, endereco, status } = req.body;

  const instituicao = await prisma.instituicao.findUnique({
    where: { id: parseInt(req.params.id) },
  });

  if (!instituicao) {
    return res.status(404).json({ error: "Instituição not found", data: null });
  }

  const newInstituicao = await prisma.instituicao.update({
    where: { id: instituicao.id },
    data: {
      nome: nome || instituicao.nome,
      descricao: descricao || instituicao.descricao,
      endereco: endereco || instituicao.endereco,
      status: status || instituicao.status,
    },
  });

  res.json(newInstituicao);
});

export default router;
