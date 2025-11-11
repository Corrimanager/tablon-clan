import { Client } from 'pg';

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Método no permitido" };
  }

  const { nombre, pass, email } = JSON.parse(event.body || "{}");
  if (!nombre || !pass || !email) {
    return { statusCode: 400, body: "Faltan campos obligatorios" };
  }

  const client = new Client({
    connectionString: process.env.NETLIFY_DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();

    // Verificar si ya existe el usuario o el email
    const check = await client.query(
      "SELECT * FROM usuarios WHERE nombre = $1 OR email = $2",
      [nombre, email]
    );
    if (check.rows.length > 0) {
      await client.end();
      return { statusCode: 400, body: "El usuario o email ya existen" };
    }

    // Insertar nuevo usuario
    await client.query(
      "INSERT INTO usuarios (nombre, pass, email) VALUES ($1, $2, $3)",
      [nombre, pass, email]
    );

    await client.end();
    return { statusCode: 200, body: "Usuario registrado correctamente" };

  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
}
