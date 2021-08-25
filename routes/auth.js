const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/Users')
const { secret } = config;
const bcrypt = require('bcrypt')
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

  try{

    const { email, password } = req.body;
    if (!email || !password) {
      return next(400);
    }

    Object.keys(req.body).length == 0 && next(400)
    Object.keys(req.body.email).length == 0 && next(400)

    const user = await User.findOne({ email: req.body.email });
      // console.log(doc)
      bcrypt.compare( req.body.password, user.password,
        (err,data)=> {
        if(err){console.info(err)} 
        
        else if(data) {return next(console.log(':C'), 404)}
 
        const token = jwt.sign({ id: user._id, roles:user.roles, email:user.email}, config.secret, {
          expiresIn: 60 * 60 *6,
        });

        res.status(200).send({ auth: true, token });
    
        // TODO: autenticar a la usuarix 2° - Ready
       //next();
       }  
      );
    if (!user) {
      return res.status(404).send("The email doesn't exists");
    }

    res.status(200)

  } catch (error) {
    return next(404);
  }

  });

  return nextMain();
};
