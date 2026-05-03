import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import public_routes from "./routes/public.js";
import categoria_routes from "./routes/categoria.js";
import cargo_routes from "./routes/cargo.js";
import departamento_routes from "./routes/departamento.js";
import instituicao_routes from "./routes/instituicao.js";
import localizacao_routes from "./routes/localizacao.js";
import item_routes from "./routes/item.js";
import registo_routes from "./routes/registo.js";
import utilizador_routes from "./routes/utilizador.js";
import condicao_routes from "./routes/condicao.js";
import authRoutes from "./routes/auth.routes.js";
import { responseFormatter } from "./middlewares/responseFormatter.middleware.js";

const app = express();
const port = process.env.PORT || 8001;
dotenv.config();

const allowedOrigins = [process.env.FRONTEND_URL];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

//middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(responseFormatter);

// public routes
app.use("/", public_routes);
app.use("/auth", authRoutes);

// protected routes
app.use("/categoria", categoria_routes);
app.use("/cargo", cargo_routes);
app.use("/departamento", departamento_routes);
app.use("/instituicao", instituicao_routes);
app.use("/localizacao", localizacao_routes);
app.use("/item", item_routes);
app.use("/registo", registo_routes);
app.use("/utilizador", utilizador_routes);
app.use("/condicao", condicao_routes);

app.listen(port, "0.0.0.0", () => {
  console.log("Running on port " + port);
});
