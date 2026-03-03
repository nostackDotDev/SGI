require("dotenv").config();

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors())
app.use(express.json())

const port =  process.env.PORT || 8001;

const db = mysql.createConnection({
  host: process.env.TIDB_HOST || "localhost",
  port: process.env.TIDB_PORT || 4000,
  user: process.env.TIDB_USER || "root",
  password: process.env.TIDB_PASS || "",
  database: process.env.TIDB_DB || "sgi",
  ssl: {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: true
  }
});

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the API",
    endpoints: {
      getUsers: "GET /api/users",
      login: "POST /api/users/login"
    }
  });
});

app.get("/api/users", (req, res) => {
  db.query("SELECT nome, password, nivel FROM users", (err, row) => {
    if (err)
      return res.status(500).json({
        message: "An error occurred",
        error: err.message,
      });
    if (row.length == 0)
      return res.status(404).json({
        message: "No match found",
        data: [],
      });
    res.json({ message: "Fetched successfully", data: row });
  });
});

app.post("/api/users/login", (req, res) => {
  const { nome, password } = req.body;

  if (!nome || !password) {
    return res.status(400).json({
      message: "Nome and password are required",
    });
  }

  db.query(
    "SELECT nome, password, nivel FROM users WHERE nome=? AND password=?",
    [nome, password],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "An error occurred",
          error: err.message,
        });
      }

      if (result.length === 0) {
        return res.status(404).json({
          message: "No match found",
          data: [],
        });
      }

      res.json({ message: "Fetched successfully", data: result });
    }
  );
});

app.listen(port, '0.0.0.0', () => {
  console.log("Listening on port", port);
});
