import { Client } from 'pg';

async function getClient() {
  return new Client({
    connectionString: process.env.NETLIFY_DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
}

export async function handler(event, context) {
  // Solo aceptamos POST desde el frontend
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ ok: false, message: 'Método no permitido' }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch (e) {
    return {
      statusCode: 400,
      body: JSON.stringify({ ok: false, message: 'JSON inválido' }),
    };
  }

  const { action, usuario, pass } = body;

  if (!action || !usuario || !pass) {
    return {
      statusCode: 400,
      body: JSON.stringify({ ok: false, message: 'Faltan datos (action, usuario, pass)' }),
    };
  }

  const client = await getClient();

  try {
    await client.connect();

    // REGISTRO
    if (action === 'register') {
      // ¿ya existe?
      const existing = await client.query(
        'SELECT id FROM usuarios WHERE usuario = $1',
        [usuario]
      );

      if (existing.rowCount > 0) {
        return {
          statusCode: 409,
          body: JSON.stringify({ ok: false, message: 'El usuario ya existe' }),
        };
      }

      await client.query(
        'INSERT INTO usuarios (usuario, pass) VALUES ($1, $2)',
        [usuario, pass]
      );

      return {
        statusCode: 200,
        body: JSON.stringify({ ok: true, message: 'Usuario registrado correctamente' }),
      };
    }

    // LOGIN
    if (action === 'login') {
      const res = await client.query(
        'SELECT id, usuario FROM usuarios WHERE usuario = $1 AND pass = $2',
        [usuario, pass]
      );

      if (res.rowCount === 0) {
        return {
          statusCode: 401,
          body: JSON.stringify({ ok: false, message: 'Usuario o contraseña incorrectos' }),
        };
      }

      return {
        statusCode: 200,
        body: JSON.stringify({
          ok: true,
          message: 'Login correcto',
          usuario: res.rows[0].usuario,
        }),
      };
    }

    // Acción desconocida
    return {
      statusCode: 400,
      body: JSON.stringify({ ok: false, message: 'Acción no reconocida' }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, message: 'Error de servidor', error: error.message }),
    };
  } finally {
    try { await client.end(); } catch (_) {}
  }
}
