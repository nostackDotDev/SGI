require("dotenv").config();

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors())
app.use(express.json())

const prisma = require("../lib/prisma")

const port = process.env.PORT || 8001;

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the API",
    endpoints: {
      getUsers: "GET /api/users",
      login: "POST /api/users/login"
    }
  });
});

app.get("/users", async (_, res) => {
  const users = await prisma.usuarios.findMany()0o

  res.json({
    data: users
  })
})

app.listen(port, '0.0.0.0', () => {
  console.log("Listening on port", port);
});
