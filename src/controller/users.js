const User = require("../models/Users");
const { 
  linkHeader,
  validObjectId,
  validEmail
} = require("../helper");
const { isAdmin } = require('../middleware/auth');

const getUser = async (req, res, next) => {
  try {
    let userId = req.params.uid;
    let response = null;

    // identificamos si el params es objectId o email
    if (validObjectId(userId)) {
      if (!isAdmin(req) && req.decoded.id !== userId) {
        return next(403);
      }
      response = await User.findById(userId);
    } else {
      if (!isAdmin(req) && req.decoded.email !== userId) {
        return next(403);
      }
      response = await User.findOne({ email: userId });
    }
    if (!response) {
      return next(404);
    }
    return res.status(200).send(response);
  } catch (error) {
    return next(404);
  }
};

const getUsers = async (req, res, next) => {
  try {
    // console.log(req.protocol) HTTP
    // console.log(req.path) ENDPOINT
    //console.log(req.get('host')) LOCALHOST

    const limit = parseInt(req.query.limit, 10) || 10;
    const page = parseInt(req.query.page, 10) || 1;

    const response = await User.paginate({}, { limit, page });

    const url = `${req.protocol}://${req.get("host") + req.path}`;

    const links = linkHeader(limit, page, response.totalPages, url, response);

    res.links(links);
    return res.status(200).json(response.docs);
  } catch (error) {
    return next(404);
  }
}; //FALTA HEADER PARAMETERS, QUERY PARAMETERS Y MANEJO DE STATUS

const saveUser = async (req, res, next) => {
  try {
    const { email, password, roles } = req.body;
    const user = new User({
      email: email,
      password: password,
      roles: roles,
    });

    if(!validEmail(email)){return next(400)};

    if (!email || !password) {
      return res.status(400).send({ message: "No hay password ni contraseña" });
    }
    if (password.length < 4) {
      return res.status(400).send("Contraseña inválida");
    }
    // user.password = await user.encryptPassword(password);

    const userValidated = User.findOne({ email: email });
    userValidated.then((doc) => {
      if (doc) {
        return next(403);
      }
    });

    const response = await user.save();
    const finalResponse = await User.findOne({ email: response.email }).select(
      "-password"
    );
    res.status(200).send(finalResponse);
  } catch (error) {
    return next(404);
  }
};

const updateuser = async (req, res, next) => {
  try {
    const userId = req.params.uid;
    const update = req.body;

    let response = null;

    if (validObjectId(userId)) {
      if (!isAdmin(req) && req.decoded.id !== userId) {
        return next(403);
      }
      if (Object.keys(user).length == 0) {
        return next(400);
      }
      response = User.findByIdAndUpdate(
        userId,
        { $set: update },
        { new: true, useFindAndModify: false }
      );
    } else {
      if (isAdmin(req)) {
        const validEmail = await User.findOne({ email: userId });
        if (!validEmail) {
          return next(404);
        }
      } else {
        if (req.decoded.email !== userId) {
          return next(403);
        }
        if (req.decoded.email === userId && update.roles) {
          return next(403);
        }
      }
      if (Object.keys(update).length == 0) {
        return next(400);
      }

      response = await User.findOneAndUpdate(
        { email: userId },
        { $set: update },
        { new: true, useFindAndModify: false }
      );
    }
    if (!response) {
      return next(403);
    }

    return res.status(200).send(response);
  } catch (error) {
    next(404);
  }
}; //MANEJO DE STATUS

const deleteuser = async (req, res, next) => {
  try {
    let userId = req.params.uid;
    let response = null;

    // identificamos si el params es objectId o email
    if (validObjectId(userId)) {
      if (!isAdmin(req) && req.decoded.id !== userId) {
        return next(403);
      }
      response = await User.findById(userId);
    } else {
      if (!isAdmin(req) && req.decoded.email !== userId) {
        return next(403);
      }
      response = await User.findOne({ email: userId });
    }
    response.remove();
    if (!response) {
      return next(404);
    }
    return res.status(200).send(response);
  } catch (error) {
    return next(404);
  }
};

module.exports = {
  getUser,
  getUsers,
  saveUser,
  deleteuser,
  updateuser,
};
// module.exports = {
//   getUsers: (req, resp, next) => {
//   },
// };
