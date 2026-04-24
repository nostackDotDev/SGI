import express from "express";
import prisma from "../lib/prisma.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const registos = await prisma.registo.findMany({
    where: { deletedAt: null },
    include: {
      item: true,
      utilizador: true,
    },
  });

  res.json({ data: registos, error: null });
});

router.get("/:id", async (req, res) => {
  const registo = await prisma.registo.findUnique({
    where: { id: parseInt(req.params.id) },
    include: {
      item: true,
      utilizador: true,
    },
  });

  if (!registo || registo.deletedAt)
    return res.status(404).json({ data: null, error: "Registo not found" });

  res.json({ data: registo, error: null });
});

router.post("/create", async (req, res) => {
  const { quantidade, itemId, utilizadorId } = req.body;

  if (!quantidade || !itemId || !utilizadorId) {
    return res.status(400).json({ data: null, error: "Todos os campos são obrigatórios" });
  }

  const item = await prisma.item.findUnique({
    where: { id: itemId },
  });

  const utilizador = await prisma.utilizador.findUnique({
    where: { id: utilizadorId },
  });

  if (!item || item.deletedAt)
    return res.status(404).json({ data: null, error: "Item not found" });

  if (!utilizador || utilizador.deletedAt)
    return res.status(404).json({ data: null, error: "Utilizador not found" });

  try {
    const newRegisto = await prisma.registo.create({
      data: {
        quantidade,
        itemId,
        utilizadorId,
      },
    });

    res.status(201).json({ data: newRegisto, error: null });
  } catch (error) {
    res.status(500).json({ data: null, error: error.message });
  }
});

router.put("/update/:id", async (req, res) => {
  const { quantidade, itemId, utilizadorId } = req.body;

  const registo = await prisma.registo.findUnique({
    where: { id: parseInt(req.params.id) },
  });

  if (!registo || registo.deletedAt) {
    return res.status(404).json({ data: null, error: "Registo not found" });
  }

  const item = itemId
    ? await prisma.item.findUnique({
        where: { id: itemId },
      })
    : null;

  const utilizador = utilizadorId
    ? await prisma.utilizador.findUnique({
        where: { id: utilizadorId },
      })
    : null;

  if (itemId && !item) {
    return res.status(404).json({ data: null, error: "Item not found" });
  }

  if (utilizadorId && !utilizador) {
    return res.status(404).json({ data: null, error: "Utilizador not found" });
  }

  try {
    const updated = await prisma.registo.update({
      where: { id: registo.id },
      data: {
        quantidade: quantidade || registo.quantidade,
        itemId: itemId || registo.itemId,
        utilizadorId: utilizadorId || registo.utilizadorId,
      },
    });

    res.json({ data: updated, error: null });
  } catch (error) {
    res.status(500).json({ data: null, error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  const registo = await prisma.registo.findUnique({
    where: { id: parseInt(req.params.id) },
  });

  if (!registo || registo.deletedAt) {
    return res.status(404).json({ data: null, error: "Registo not found" });
  }

  try {
    const deletedRegisto = await prisma.registo.update({
      where: { id: registo.id },
      data: { deletedAt: new Date() },
    });

    res.json({ data: deletedRegisto, error: null });
  } catch (error) {
    res.status(500).json({ data: null, error: error.message });
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
