//import "dotenv".config();
import prisma from "../lib/prisma.js"
import express from "express"

const router = express.Router()

//areas restritas são rotas privadas
// biblioteca para encriptar a senha: bcrypt

router.get("/", (req, res) => {
  res.json({
    message: "Welcome to the API",
    endpoints: {
      empty: true
    }
  });
});

//Login control
router.get("/users", async (_, res) => {
  const users = await prisma.utilizador.findMany()

  res.json(
    users
  )
})


router.post("/cadastro", async (req, res) => {
  try {
    const { email, nome, password } = req.body
    await prisma.utilizador.create({
      data: {
        email,
        nome,
        password,
      }
    })
    res.status(201).json(user)
  } catch (error) {
    res.status(500).json({ message: "Erro found, try again", error: error.message })
  }


})


export default router