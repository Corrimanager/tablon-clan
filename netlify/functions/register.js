import { Client } from 'pg';

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Método no permitido" };
  }

  const { nombre, password } = JSON.parse(event.body || "{}");
  if (!nombre || !password) {
    return { statusCode: 400, body: "Faltan campos obligatorios" };
  }

  const client = new Client({
    connectionString: process.env.NETLIFY_DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();

    // Verificar si el usuario ya existe
    const check = await client.query("SELECT * FROM usuarios WHERE nombre = $1", [nombre]);
    if (check.rows.length > 0) {
      await client.end();
      return { statusCode: 400, body: "El usuario ya existe" };
    }

    // Insertar el nuevo usuario
    await client.query("INSERT INTO usuarios (nombre, password) VALUES ($1, $2)", [nombre, password]);
    await client.end();

    return { statusCode: 200, body: "Usuario registrado correctamente" };

  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
}
