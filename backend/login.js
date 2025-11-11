import { Client } from 'pg';

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Método no permitido" };
  }

  const { nombre, pass } = JSON.parse(event.body || "{}");
  if (!nombre || !pass) {
    return { statusCode: 400, body: "Faltan campos obligatorios" };
  }

  const client = new Client({
    connectionString: process.env.NETLIFY_DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();

    const res = await client.query("SELECT * FROM usuarios WHERE nombre = $1 AND pass = $2", [nombre, pass]);
    await client.end();

    if (res.rows.length === 0) {
      return { statusCode: 401, body: "Credenciales incorrectas" };
    }

    return { statusCode: 200, body: JSON.stringify({ mensaje: "Login exitoso", usuario: res.rows[0] }) };

  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
}
