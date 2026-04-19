//import "dotenv".config();
import prisma from "../lib/prisma.js";
import express from "express";

const router = express.Router();

//areas restritas são rotas privadas
// biblioteca para encriptar a senha: bcrypt

router.get("/", (req, res) => {
  res.json({
    message: "Welcome to the API",
    endpoints: {
      empty: true,
    },
  });
});

//Login control
router.get("/users", async (_, res) => {
  const users = await prisma.utilizador.findMany();

  res.json(users);
});

router.post("/cadastro", async (req, res) => {
  try {
    const { email, nome, password, descricao, cargoId } = req.body;

    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }

    if (!cargoId) res.status(400).json({ error: "Cargo is required" });

    if (!email) res.status(400).json({ error: "Email is required" });

    const cargo = await prisma.cargo.findUnique({
      where: { id: cargoId },
    });

    if (!cargo) {
      return res.status(404).json({
        message: "Falha ao criar utilizador",
        error: "Cargo não encontrado",
      });
    }

    const user = await prisma.utilizador.create({
      data: {
        email,
        nome,
        password,
        cargoId,
        descricao: descricao || "",
      },
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({
      message: "Erro found, try again",
      error: error.message,
    });
  }
});

export default router;
