const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3000;
const SECRET_KEY = 'mi_clave_secreta_123'; // clave para JWT

app.use(cors());
app.use(express.json());

// Inicializar base de datos
const db = new sqlite3.Database('./db/misiones.db', (err)=>{
  if(err) console.log('Error DB:',err);
  else console.log('Base de datos conectada');
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )`);
});

// Registro de usuario
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashed], function(err){
    if(err) return res.status(400).json({error: 'Usuario ya existe'});
    res.json({message: 'Usuario creado'});
  });
});

// Login
app.post('/login', (req,res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM users WHERE username = ?', [username], async (err,user)=>{
    if(!user) return res.status(400).json({error:'Usuario no encontrado'});
    const match = await bcrypt.compare(password, user.password);
    if(!match) return res.status(400).json({error:'Contraseña incorrecta'});
    const token = jwt.sign({id:user.id, username:user.username}, SECRET_KEY, {expiresIn:'1h'});
    res.json({token});
  });
});

// Middleware para rutas protegidas
function auth(req,res,next){
  const token = req.headers['authorization'];
  if(!token) return res.status(401).json({error:'No autorizado'});
  jwt.verify(token, SECRET_KEY, (err,data)=>{
    if(err) return res.status(403).json({error:'Token inválido'});
    req.user = data;
    next();
  });
}

// Ruta protegida ejemplo
app.get('/misiones', auth, (req,res)=>{
  res.json({message:`Hola ${req.user.username}, aquí tus misiones`});
});

app.listen(PORT, ()=>console.log(`Servidor corriendo en http://localhost:${PORT}`));
