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
    // const { email, password } = req.body;
    // if (!email || !password) {
    //   return next(400);
    // }
    
 

    const user = await User.findOne({ email: req.body.email }, function(err, doc){
      // console.log(doc)
      bcrypt.compare( req.body.password, doc.password,
        (err,data)=> {
        if(err){console.info(err)} 
        
        else if(data) {return next(console.log(':C'), 404)}
 
        const token = jwt.sign({ id: doc._id, roles:doc.roles, email:doc.email}, config.secret, {
          expiresIn: 60 * 60 *6,
        });
        res.status(200).json({ auth: true, token });
    
        // TODO: autenticar a la usuarix 2° - Ready
       //next();
      
      }
  
        
      );
    });
    
    if (!user) {
      return res.status(404).send("The email doesn't exists");
    }
   


    
  });


  return nextMain();
};
