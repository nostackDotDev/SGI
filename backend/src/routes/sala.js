import express from "express";
import prisma from "../lib/prisma.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const salas = await prisma.sala.findMany();

  res.json({
    message: "Sala routes are working!",
    data: salas,
  });
});

router.get("/:id", async (req, res) => {
  const sala = await prisma.sala.findUnique({
    where: { id: parseInt(req.params.id) },
  });

  if (!sala) {
    return res.status(404).json({ error: "Sala not found", data: null });
  }

  res.json({ message: "", data: sala });
});

router.post("/create", async (req, res) => {
  const { numeroSala, tipoSala, departamentoId } = req.body;

  if (!numeroSala || !departamentoId) {
    return res
      .status(400)
      .json({ error: "Nome e departamento são obrigatórios" });
  }

  const departamento = await prisma.departamento.findUnique({
    where: { id: departamentoId },
  });

  if (!departamento) {
    return res.status(404).json({ error: "Departamento not found" });
  }

  try {
    const newDepartamento = await prisma.sala.create({
      data: {
        numeroSala,
        tipoSala: tipoSala || "",
        departamentoId,
      },
    });

    res.status(201).json(newDepartamento);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create sala", error: error.message });
  }
});

router.put("/update/:id", async (req, res) => {
  const { numeroSala, tipoSala, departamentoId, status } = req.body;

  const sala = await prisma.sala.findUnique({
    where: { id: parseInt(req.params.id) },
  });

  if (!sala) {
    return res.status(404).json({ error: "Sala not found", data: null });
  }

  const departamento = await prisma.departamento.findUnique({
    where: { id: departamentoId },
  });

  if (!departamento) {
    return res
      .status(404)
      .json({ error: "Departamento not found", data: null });
  }

  const newDepartamento = await prisma.sala.update({
    where: { id: sala.id },
    data: {
      numeroSala: numeroSala || sala.numeroSala,
      tipoSala: tipoSala || sala.tipoSala,
      departamentoId: departamentoId || sala.departamentoId,
      status: status || sala.status,
    },
  });

  res.json(newDepartamento);
});

export default router;
