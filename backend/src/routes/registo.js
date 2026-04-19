import express from "express";
import prisma from "../lib/prisma.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const registos = await prisma.registo.findMany();

  res.json({ message: "Registos routes are working!", data: registos });
});

router.get("/:id", async (req, res) => {
  const registo = await prisma.registo.findUnique({
    where: { id: parseInt(req.params.id) },
  });

  if (!registo)
    return res.status(404).json({ error: "Registo not found", data: null });

  res.json({ message: "Registos routes are working!", data: registo });
});

router.post("/create", async (req, res) => {
  const { quantidade, registrado, itemId, utilizadorId } = req.body;

  if ((!quantidade || !registrado || !itemId, !utilizadorId)) {
    return res
      .status(400)
      .json({ error: "Todos os campos são obrigatórias", data: null });
  }

  const item = await prisma.item.findUnique({
    where: { id: itemId },
  });

  const utilizador = await prisma.utilizador.findUnique({
    where: { id: utilizadorId },
  });

  if (!item)
    return res.status(404).json({ error: "Item not found", data: null });

  if (!utilizador)
    return res.status(404).json({ error: "Utilizador not found", data: null });

  try {
    const newRegisto = await prisma.registo.create({
      data: {
        quantidade,
        registrado,
        itemId,
        utilizadorId,
      },
    });

    res.status(201).json(newRegisto);
  } catch (error) {
    res.status(500).json({ error: error.message, data: null });
  }
});

// router.put("/update/:id", async (req, res) => {
//   const { quantidade, itemId, utilizadorId } = req.body;

//   const registo = await prisma.registo.findUnique({
//     where: { id: parseInt(req.params.id) },
//   });

//   if(!registo) return

//   const item = await prisma.item.findUnique({
//     where: { id: itemId },
//   });

//   const utilizador = await prisma.utilizador.findUnique({
//     where: { id: utilizadorId },
//   });

//   if (!item) return res.status(404).json({ error: "Item not found" });

//   if (!utilizador)
//     return res.status(404).json({ error: "Utilizador not found" });

//   try {
//     const newRegisto = await prisma.registo.create({
//       data: {
//         quantidade,
//         registrado,
//         itemId,
//         utilizadorId,
//       },
//     });

//     res.status(201).json(newRegisto);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ error: "Failed to create registo", error: error.message });
//   }
// });

export default router;
