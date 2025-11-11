import express from "express";
import pkg from "pg";
import cors from "cors";

const { Pool } = pkg;
const app = express();
app.use(express.json());
app.use(cors());

const pool = new Pool({
  connectionString: "postgresql://postgres:[YOUR_PASSWORD]@db.ipwxzkdpgbwgdeflzaks.supabase.co:5432/postgres",
  ssl: { rejectUnauthorized: false },
});

// --- Registro de usuarios ---
app.post("/register", async (req, res) => {
  const { nombre, pass, email } = req.body;
  if (!nombre || !pass || !email) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }
  try {
    await pool.query(
      "INSERT INTO usuarios (nombre, pass, email) VALUES ($1, $2, $3)",
      [nombre, pass, email]
    );
    res.json({ message: "Usuario registrado correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// --- Login ---
app.post("/login", async (req, res) => {
  const { nombre, pass } = req.body;
  if (!nombre || !pass) {
    return res.status(400).json({ error: "Faltan campos" });
  }
  try {
    const result = await pool.query(
      "SELECT * FROM usuarios WHERE nombre=$1 AND pass=$2",
      [nombre, pass]
    );
    if (result.rows.length === 0) {
      res.status(401).json({ error: "Usuario o contraseña incorrectos" });
    } else {
      res.json({ message: "Login exitoso", usuario: result.rows[0] });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// --- Inicio ---
app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente 🚀");
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Servidor iniciado en puerto ${port}`));
