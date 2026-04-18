import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import public_routes from "./routes/public.js";

const app = express();
const port = process.env.PORT || 8001;
dotenv.config()

//middlewares
app.use(cors())
app.use(express.json())
app.use("/", public_routes)


app.listen(port, '0.0.0.0', () => {
  console.log("Afinal funciona..." + " " + port)

});
