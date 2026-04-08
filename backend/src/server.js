/*require("dotenv").config();
const prisma = require("../lib/prisma");*/

import express from "express"
import cors from "cors"
import public_routes from "./routes/public.js";

const app = express();
const port = process.env.PORT || 8001;

//middlewares
app.use(cors())
app.use(express.json())
app.use("/", public_routes)


app.get("/", (req, res) => {
  /*res.json({
    message: "Welcome to the API",
    endpoints: {
      empty: true
    }
  });*/
  res.send("A rota raiz funciona, sem conteúdo ainda...")
});

/*app.get("/users", async (_, res) => {
  const users = await prisma.user.findMany()

  res.json({
    data: users
  })
})*/

app.listen(port, '0.0.0.0', () => {
  //console.log("Listening on port", port);
  console.log("Afinal funciona..." + " " + port)

});
