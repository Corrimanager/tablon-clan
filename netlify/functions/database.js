import { Client } from 'pg';

export async function handler(event, context) {
  const client = new Client({
    connectionString: process.env.NETLIFY_DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    const res = await client.query('SELECT NOW() AS fecha_actual;');
    await client.end();

    return {
      statusCode: 200,
      body: JSON.stringify({
        mensaje: '✅ Conexión exitosa con la base de datos Neon',
        servidor: process.env.NETLIFY_DATABASE_URL ? 'Detectado' : 'No detectado',
        resultado: res.rows
      }, null, 2)
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}

