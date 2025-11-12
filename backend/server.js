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

// server.js
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Para conexiones internas de Railway, es mejor no forzar SSL
  // Si la conexión fallara aquí, Railway debería manejarlo.
});

// ✅ Endpoint base para verificar si el servidor responde
app.get("/", (req, res) => {
  res.json({ message: "Servidor funcionando correctamente 🚀" });
});

// ✅ Código corregido para el registro (/register)

app.post("/register", async (req, res) => {
  // ... omisión de código ...

  try {
    // 1. SELECT: Cambiar "usuarios" por "public.usuarios"
    const checkUser = await pool.query("SELECT * FROM public.usuarios WHERE nombre = $1", [nombre]); 
    if (checkUser.rows.length > 0) {
      return res.status(400).json({ error: "El usuario ya existe" });
    }

    // 2. INSERT: Cambiar "usuarios" por "public.usuarios"
    await pool.query("INSERT INTO public.usuarios (nombre, email, pass) VALUES ($1, $2, $3)", [
      nombre,
      email,
      pass,
    ]);

    res.json({ message: "Usuario registrado exitosamente ✅" });
  } catch (err) {
    // ... omisión de código ...
  }
});

// ✅ Código corregido para el login (/login)

app.post("/login", async (req, res) => {
  // ... omisión de código ...

  try {
    // 3. SELECT: Cambiar "usuarios" por "public.usuarios"
    const result = await pool.query(
      "SELECT * FROM public.usuarios WHERE nombre = $1 AND pass = $2",
      [nombre, pass]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Usuario o contraseña incorrectos ❌" });
    }
    // ... omisión de código ...
  }
});

// ✅ Puerto
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
