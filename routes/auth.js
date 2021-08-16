const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/Users')
const { secret } = config;

/** @module auth */
module.exports = (app, nextMain) => {
  /**
   * @name /auth
   * @description Crea token de autenticación.
   * @path {POST} /auth
   * @body {String} email Correo
   * @body {String} password Contraseña
   * @response {Object} resp
   * @response {String} resp.token Token a usar para los requests sucesivos
   * @code {200} si la autenticación es correcta
   * @code {400} si no se proveen `email` o `password` o ninguno de los dos
   * @auth No requiere autenticación
   */
   app.post('/auth', async (req, res, next) => {
    // const { email, password } = req.body;
    // if (!email || !password) {
    //   return next(400);
    // }
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send("The email doesn't exists");
    }
   
    const validPassword = await user.comparePassword(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res.status(401).send({ auth: false, token: null });
    }
    const token = jwt.sign({ id: user._id, roles:user.roles}, config.secret, {
      expiresIn: 60 * 60 *6,
    });
    res.status(200).json({ auth: true, token });

    // TODO: autenticar a la usuarix 2° - Ready
    next();
  });


  return nextMain();
};
