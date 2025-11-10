import { Client } from 'pg'

export async function handler(event, context) {
  const client = new Client({
    connectionString: process.env.NETLIFY_DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();

    // Ejemplo: devuelve todos los usuarios
    const res = await client.query('SELECT * FROM usuarios;');

    await client.end();

    return {
      statusCode: 200,
      body: JSON.stringify(res.rows)
    };

  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}
