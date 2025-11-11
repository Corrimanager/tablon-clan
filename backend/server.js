import express from "express";
import cors from "cors";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: "*", // Permite cualquier origen (por ahora)
    methods: ["GET", "POST"],
  })
);

// O mejor (permitir cualquier subdominio de Vercel y tu dominio principal):
/*
app.use(
  cors({
    origin: [
      "https://tablon-clan.vercel.app",
      /https:\/\/[a-zA-Z0-9-]+\.vercel\.app$/, // Esto permite los dominios de preview de Vercel
    ],
    methods: ["GET", "POST"],
  })
);
*/

app.use(express.json());

// ✅ Conexión a la base de datos (Supabase o Railway)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// ✅ Endpoint base para verificar si el servidor responde
app.get("/", (req, res) => {
  res.json({ message: "Servidor funcionando correctamente 🚀" });
});

// ✅ Registro de usuario
app.post("/register", async (req, res) => {
  const { nombre, email, pass } = req.body;

  if (!nombre || !email || !pass) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  try {
    const checkUser = await pool.query("SELECT * FROM usuarios WHERE nombre = $1", [nombre]);
    if (checkUser.rows.length > 0) {
      return res.status(400).json({ error: "El usuario ya existe" });
    }

    await pool.query("INSERT INTO usuarios (nombre, email, pass) VALUES ($1, $2, $3)", [
      nombre,
      email,
      pass,
    ]);

    res.json({ message: "Usuario registrado exitosamente ✅" });
  } catch (err) {
    console.error("Error en /register:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// ✅ Login de usuario
app.post("/login", async (req, res) => {
  const { nombre, pass } = req.body;

  if (!nombre || !pass) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM usuarios WHERE nombre = $1 AND pass = $2",
      [nombre, pass]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Usuario o contraseña incorrectos ❌" });
    }

    res.json({ message: "Inicio de sesión exitoso ✅", usuario: result.rows[0] });
  } catch (err) {
    console.error("Error en /login:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// ✅ Puerto
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
