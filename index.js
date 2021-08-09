const mongoose = require('mongoose');
const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');
const authMiddleware = require('./middleware/auth');
const errorHandler = require('./middleware/error');
const routes = require('./routes');
const pkg = require('./package.json');

const { port, dbUrl, secret } = config;
mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  // eslint-disable-next-line no-console
  .then(console.log('sucess'))
  .catch(console.error);

const app = express();

// TODO: Conexión a la Base de Datos (MongoDB o MySQL)
<<<<<<< HEAD

mongoose
.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
// eslint-disable-next-line no-console
.then(console.log('yei'))
.catch(console.error);

=======
>>>>>>> cac833abd3678d13c34e0eb3393c42bf51c5d73b
app.set('config', config);
app.set('pkg', pkg);

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
