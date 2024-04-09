const express = require('express');
const config = require('./src/config');
const authMiddleware = require('./src/middleware/auth');
const errorHandler = require('./src/middleware/error');
const routes = require('./src/routes');
const pkg = require('./package.json');

const { port, secret } = config;
const app = express();

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

  module.exports = app;

  app.use(errorHandler);

  app.listen(port, () => {
    console.info(`App listening on port ${port}`);
  });
});
