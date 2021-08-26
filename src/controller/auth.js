const jwt = require("jsonwebtoken");
const User = require("../models/Users");
const config = require("../../config");
const bcrypt = require("bcrypt");
const { 
  isEmptyObj
} = require("../helper");

const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(400);
    }

    if (isEmptyObj(req.body)) {
      return next(400);
    }
    if (isEmptyObj(email)){
      return next(400);
    }

    const user = await User.findOne({ email: email });
    bcrypt.compare(password, user.password, (err, data) => {
      if (err) {
        console.info(err);
      } else if (data) {
        return next(404);
      }

      const token = jwt.sign(
        { id: user._id, roles: user.roles, email: user.email },
        config.secret,
        {
          expiresIn: 60 * 60 * 6,
        }
      );

      res.status(200).send({ auth: true, token });

      // TODO: autenticar a la usuarix 2° - Ready
      //next();
    });
    if (!user) {
      return res.status(404).send("The email doesn't exists");
    }

    res.status(200);
  } catch (error) {
    return next(404);
  }
};

module.exports = {
  signIn,
};
