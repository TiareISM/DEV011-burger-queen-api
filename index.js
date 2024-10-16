const express = require('express');
const cors = require('cors');
const config = require('./config');
const authMiddleware = require('./middleware/auth');
const errorHandler = require('./middleware/error');
const routes = require('./routes');
const pkg = require('./package.json');

const { port, secret } = config;
const app = express();
// Habilitar cors para las peticiones
app.use(cors({ origin: 'http://localhost:5173' }));

app.set('config', config);
app.set('pkg', pkg);

// parse application/x-www-form-urlencoded
// Configurar middleware para analizar cuerpos de solicitudes con formato x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
// Configurar middleware para analizar cuerpos de solicitudes con formato JSON
app.use(express.json());
// Configurar middleware de autenticación con una clave secreta
app.use(authMiddleware(secret));

// Registrar rutas
routes(app, (err) => {
  if (err) {
    console.error('Error al registrar rutas:', err);
    throw err;
  }

  app.use(errorHandler);
});

app.listen(port, () => {
  console.info(`App listening on port ${port}`);
});

module.exports = app;
