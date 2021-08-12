const jwt = require('jsonwebtoken');
const config = require('../config')

module.exports = (secret) => (req, resp, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return next();
  }

  const [type, token] = authorization.split(' ');

  if (type.toLowerCase() !== 'bearer') {
    return next();
  }

  jwt.verify(token, secret, (err, decodedToken) => {
    if (err) {
      return next(403);
    }
    // TODO: Verificar identidad del usuario usando `decodeToken.uid` 2nd
  });
};


module.exports.isAuthenticated = (req, res, next) => {
    if(!req.headers.authorization){
      return res.status(403).send({message:'No tienes autorización'})
    }

    const token = req.headers.authorization.split("")[1];
    const payload = jwt.verify(token, config.secret);

    if(payload.iat + payload.expiresIn <= new Date()){
      return res.status(401).send({message:'El token ha expirado'})
    }
    
    req.user= payload.id
    next()
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
