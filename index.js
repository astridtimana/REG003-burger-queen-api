const mongoose = require('mongoose');
const express = require('express');
const config = require('./config');
const authMiddleware = require('./src/middleware/auth');
const errorHandler = require('./src/middleware/error');
const routes = require('./src/routes');
const pkg = require('./package.json');

const { port, dbUrl, secret } = config;
mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  // eslint-disable-next-line no-console
  .then(console.log('yei'))
  .catch(console.error);

const app = express();


app.set('config', config);
app.set('pkg', pkg);
//******** Ejemplo Uso de Middleware */
// app.use((req, res, next)=> {
//   console.log('Línea 25')
//   next()
// })

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(authMiddleware(secret));

// Registrar rutas
routes(app, (err) => {
  if (err) {
    throw err;
  }

  app.use(errorHandler);

  app.listen(port, () => {
    console.info(`App listening on port ${port}`);
  });
});
