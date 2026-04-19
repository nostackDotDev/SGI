import express from "express";
import prisma from "../lib/prisma.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const cargos = await prisma.cargo.findMany();

  res.json({ message: "Cargo routes are working!", data: cargos });
});

router.get("/:id", async (req, res) => {
  const cargo = await prisma.cargo.findUnique({
    where: { id: parseInt(req.params.id) },
  });

  if (!cargo) {
    return res.status(404).json({ error: "Cargo not found" });
  }

  res.json({ message: "", data: cargo });
});

router.post("/create", async (req, res) => {
  const { nome, permissoes, descricao } = req.body;

  if (!nome || !permissoes) {
    return res
      .status(400)
      .json({ error: "Nome e permissões são obrigatórias" });
  }

  try {
    const newCargo = await prisma.cargo.create({
      data: {
        nome: nome || "",
        descricao: descricao || "",
        permissoes: permissoes || [],
      },
    });

    res.status(201).json(newCargo);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create cargo", error: error.message });
  }
});

router.put("/update/:id", async (req, res) => {
  const { nome, permissoes, descricao } = req.body;

  const cargo = await prisma.cargo.findUnique({
    where: { id: parseInt(req.params.id) },
  });

  if (!cargo) {
    return res.status(404).json({ error: "Cargo not found" });
  }

  const newCargo = await prisma.cargo.update({
    where: { id: cargo.id },
    data: {
      nome: nome || cargo.nome,
      descricao: descricao || cargo.descricao,
      permissoes: permissoes || cargo.permissoes,
    },
  });

  res.json(newCargo);
});

export default router;
