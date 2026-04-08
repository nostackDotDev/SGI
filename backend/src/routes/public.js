//import "dotenv".config();
import prisma from "../lib/prisma.js"
import express from "express"

const router = express.Router()

//areas restritas são rotas privadas
// biblioteca para enciptar a senha: bcrypt


//User control
router.get("/users", async (_, res) => {
  const users = await prisma.user.findMany()

  res.json({
    data: users
  })
})


router.post("/cadastro", async (req, res) => {
    try {
        const user = req.body
    
    /*res.json({
        message: "Cadastro recebido!",
        data: user
    })*/
   await prisma.usuarios.create({
    data: {
        name: user.name,
        email: user.email,
    }
   })
   res.status(201).json(user)        
    } catch (error) {
        res.status(500).json ({message: "Erro no server, try again", error: error.message})
    }
    

})


export default router