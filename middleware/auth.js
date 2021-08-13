const jwt = require('jsonwebtoken');
const config = require('../config')

module.exports = (secret) => (req, res, next) => {
  const { authorization } = req.headers;
  //console.log(req)

  if (!authorization) {
    return res.status(403).send({message:'No tienes autorización'})
    //return next();
  }

  const [type, token] = authorization.split(' ');

  if (type.toLowerCase() !== 'bearer') {
    return res.status(400).send({message:'Type no es "bearer" '})
    //return next();
  }

  jwt.verify(token, secret, (err, decodedToken) => {
    console.log(decodedToken)
    if (err) {
      return next(403);
    }
    // TODO: Verificar identidad del usuario usando `decodeToken.uid` 2nd
  });
};


module.exports.isAuthenticated = (req) => {

  // TODO: decidir por la informacion del request si la usuaria esta autenticada

  req.token || false
    
};


module.exports.isAdmin = (req) => (
  // TODO: decidir por la informacion del request si la usuaria es admin 3rd
  false
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
