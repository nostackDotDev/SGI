//import "dotenv".config();
import prisma from "../lib/prisma.js"
import express from "express"

const router = express.Router()

//areas restritas são rotas privadas
// biblioteca para encriptar a senha: bcrypt

router.get("/", (req, res) => {
  /*res.json({
    message: "Welcome to the API",
    endpoints: {
      empty: true
    }
  });*/
  res.send("A rota raiz funciona, sem conteúdo ainda...")
});

//User control
router.get("/users", async (_, res) => {
  const users = await prisma.utilizador.findMany()

  res.json(
    users
  )
})




router.post("/cadastro", async (req, res) => {
    try {
        const user = req.body
    
    /*res.json({
        message: "Cadastro recebido!",
        data: user
    })*/
   await prisma.utilizador.create({
    data: {
        nome: user.nome,
        email: user.email,
        password: user.password,
        descricao: user.descricao,
        //cargo: user.
        
    }
   })
   res.status(201).json(user)  
         
    } catch (error) {
        res.status(500).json ({message: "Erro no server, try again", error: error.message})
    }
    

})


export default router