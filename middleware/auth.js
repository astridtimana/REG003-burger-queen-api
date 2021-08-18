const jwt = require('jsonwebtoken');
const User = require('../models/Users')

module.exports = (secret) => (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    //return res.status(403).send({message:'No tienes autorización'})
    return next();
  }

  const [type, token] = authorization.split(' ');

  if (type.toLowerCase() !== 'bearer') {
    return res.status(400).send({message:'Type no es "bearer" '})
    //return next();
  }

  jwt.verify(token, secret, (err, decodedToken) => {
    if (err) {
      return next(403);
    }

    const userValidated = User.findById(decodedToken.id)
    userValidated.then((user)=>{
      if (!user) {
        res.status(404).send({message:`No existe usuario`})
      }
      req.decoded = decodedToken
      next()
    })      
    .catch((err) => {
      console.info('Ha ocurrido un error, auth-middleware', err);
    });

    //next()
    // TODO: Verificar identidad del usuario usando `decodeToken.uid` 2nd
  });


};


module.exports.isAuthenticated = (req) => (
  // TODO: decidir por la informacion del request si la usuaria esta autenticada
  req.decoded||false
  
);


module.exports.isAdmin = (req) => (
  // TODO: decidir por la informacion del request si la usuaria es admin
  req.decoded.roles.admin||false
);


module.exports.requireAuth = (req, resp, next) => (
  (!module.exports.isAuthenticated(req))
    ? next(401)
    : next()
);


module.exports.requireAdmin = (req, resp, next) => (
  // eslint-disable-next-line no-nested-ternary
  (!module.exports.isAuthenticated(req))
    ? next(401)
    : (!module.exports.isAdmin(req))
      ? next(403)
      : next()
);
