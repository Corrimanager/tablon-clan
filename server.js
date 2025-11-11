const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

app.get("/", (req, res) => {
  res.json({ message: "Servidor funcionando correctamente 🚀" });
});

app.listen(3000, () => {
  console.log("Servidor corriendo en puerto 3000");
});
