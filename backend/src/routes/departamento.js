import express from "express";
import prisma from "../lib/prisma.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const departamentos = await prisma.departamento.findMany();

  res.json({
    message: "Departamento routes are working!",
    data: departamentos,
  });
});

router.get("/:id", async (req, res) => {
  const departamento = await prisma.departamento.findUnique({
    where: { id: parseInt(req.params.id) },
  });

  if (!departamento) {
    return res
      .status(404)
      .json({ error: "Departamento not found", data: null });
  }

  res.json({ message: "", data: departamento });
});

router.post("/create", async (req, res) => {
  const { nome, descricao, instituicaoId } = req.body;

  if (!nome || !instituicaoId) {
    return res
      .status(400)
      .json({ error: "Nome e instituição são obrigatórias" });
  }

  const instituicao = await prisma.instituicao.findUnique({
    where: { id: instituicaoId },
  });

  if (!instituicao) {
    return res.status(404).json({ error: "Instituição not found" });
  }

  try {
    const newDepartamento = await prisma.departamento.create({
      data: {
        nome,
        descricao: descricao || "",
        instituicaoId,
      },
    });

    res.status(201).json(newDepartamento);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create departamento", error: error.message });
  }
});

router.put("/update/:id", async (req, res) => {
  const { nome, descricao, instituicaoId, status } = req.body;

  const departamento = await prisma.departamento.findUnique({
    where: { id: parseInt(req.params.id) },
  });

  if (!departamento) {
    return res
      .status(404)
      .json({ error: "Departamento not found", data: null });
  }

  const instituicao = instituicaoId
    ? await prisma.instituicao.findUnique({
        where: { id: instituicaoId },
      })
    : null;

  if (!instituicao && instituicaoId) {
    return res.status(404).json({ error: "Instituição not found", data: null });
  }

  const newDepartamento = await prisma.departamento.update({
    where: { id: departamento.id },
    data: {
      nome: nome || departamento.nome,
      descricao: descricao || departamento.descricao,
      instituicaoId: instituicaoId || departamento.instituicaoId,
      status: status || departamento.status,
    },
  });

  res.json(newDepartamento);
});

export default router;
