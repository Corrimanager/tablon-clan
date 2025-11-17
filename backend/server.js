import express from "express";
import cors from "cors";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();
const app = express();

// 1. CORRECCIÓN DE CORS: Permite el dominio de producción Y cualquier subdominio de Vercel (Previews)
const VERCEL_DOMAINS = [
  "https://tablon-clan.vercel.app", 
  /https:\/\/[a-zA-Z0-9-]+\.vercel\.app$/, // Permite dominios de prueba/preview
];

app.use(
  cors({
    origin: VERCEL_DOMAINS,
    methods: ["GET", "POST"],
    credentials: true, // Necesario si manejas cookies o sesiones
  })
);

app.use(express.json());

// 2. CORRECCIÓN DE CONEXIÓN: Se elimina la configuración SSL innecesaria para Railway
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Ya no es necesario 'ssl: { rejectUnauthorized: false }'
});

// Endpoint base para verificar si el servidor responde (lo que probaste manualmente)
app.get("/", (req, res) => {
  res.json({ message: "Servidor funcionando correctamente 🚀" });
});

// Registro de usuario
app.post("/register", async (req, res) => {
  const { nombre, email, pass } = req.body;

  if (!nombre || !email || !pass) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  try {
    // 3. CORRECCIÓN SQL: Se añade 'public.' para buscar la tabla
    const checkUser = await pool.query("SELECT * FROM public.usuarios WHERE nombre = $1", [nombre]);
    if (checkUser.rows.length > 0) {
      return res.status(400).json({ error: "El usuario ya existe" });
    }

    // 4. CORRECCIÓN SQL: Se añade 'public.' en el INSERT
    await pool.query("INSERT INTO public.usuarios (nombre, email, pass) VALUES ($1, $2, $3)", [
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

// Login de usuario
app.post("/login", async (req, res) => {
  const { nombre, pass } = req.body;

  if (!nombre || !pass) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  try {
    // 5. CORRECCIÓN SQL: Se añade 'public.' para buscar la tabla
    const result = await pool.query(
      "SELECT * FROM public.usuarios WHERE nombre = $1 AND pass = $2",
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

// Puerto de escucha
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
