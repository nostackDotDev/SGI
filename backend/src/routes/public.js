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


router.post("/cadastro", async (req, res) => {
  try {
    const { instituicaoName, instituicaoAddress, userName, userEmail, userPassword } = req.body;

    // Validate required fields
    if (!instituicaoName) {
      return res.status(400).json({ data: null, error: "Nome da instituição é obrigatório" });
    }

    if (!userName) {
      return res.status(400).json({ data: null, error: "Nome do usuário é obrigatório" });
    }

    if (!userEmail) {
      return res.status(400).json({ data: null, error: "Email do usuário é obrigatório" });
    }

    if (!userPassword) {
      return res.status(400).json({ data: null, error: "Senha do usuário é obrigatória" });
    }

    // Check if cargo with id 1 exists (default admin cargo)
    const cargo = await prisma.cargo.findUnique({
      where: { id: 1 },
    });

    if (!cargo) {
      return res.status(500).json({ data: null, error: "Cargo padrão não encontrado. Configure o sistema primeiro." });
    }

    const result = await prisma.$transaction(async (tx) => {
      const instituicao = await tx.instituicao.create({
        data: {
          nome: instituicaoName,
          endereco: instituicaoAddress || "",
          descricao: "",
        },
      });

      const user = await tx.utilizador.create({
        data: {
          nome: userName,
          email: userEmail,
          password: userPassword,
          descricao: "",
          cargo: {
            connect: { id: 1 },
          },
          instituicao: {
            connect: { id: instituicao.id },
          },
        },
        include: {
          cargo: true,
          instituicao: true,
        },
      });

      return { instituicao, user };
    });

    res.status(201).json({
      data: result,
      error: null,
      message: "Instituição e usuário criados com sucesso",
    });
  } catch (error) {
    // Handle unique constraint violations
    if (error.code === "P2002") {
      if (error.meta?.target?.includes("email")) {
        return res.status(400).json({ data: null, error: "Email já está em uso" });
      }
      if (error.meta?.target?.includes("nome")) {
        return res.status(400).json({ data: null, error: "Nome da instituição já existe" });
      }
    }

    res.status(500).json({ data: null, error: error.message });
  }
});

export default router;
