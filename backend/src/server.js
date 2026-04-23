import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import public_routes from "./routes/public.js";
import categoria_routes from "./routes/categoria.js";
import cargo_routes from "./routes/cargo.js";
import departamento_routes from "./routes/departamento.js";
import instituicao_routes from "./routes/instituicao.js";
import sala_routes from "./routes/sala.js";
import item_routes from "./routes/item.js";
import registo_routes from "./routes/registo.js";
import utilizador_routes from "./routes/utilizador.js";
import condicao_routes from "./routes/condicao.js";

const app = express();
const port = process.env.PORT || 8001;
dotenv.config();

//middlewares
app.use(cors());
app.use(express.json());
app.use("/", public_routes);
app.use("/categoria", categoria_routes);
app.use("/cargo", cargo_routes);
app.use("/departamento", departamento_routes);
app.use("/instituicao", instituicao_routes);
app.use("/sala", sala_routes);
app.use("/item", item_routes);
app.use("/registo", registo_routes);
app.use("/utilizador", utilizador_routes);
app.use("/condicao", condicao_routes);

app.listen(port, "0.0.0.0", () => {
  console.log("Afinal funciona..." + " " + port);
});
