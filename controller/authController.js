const jwt = require('jsonwebtoken')
const User = require('../models/Users');
const config = require('../config')

const signUp = async (req,res,next) =>{
    const {email, password, roles} = req.body;
    const user = new User({
        email : email,
        password : password,
        roles: roles
    })
    // console.log(user)

    // encrypt the user's password
    user.password = await user.encryptPassword(password);
    await user.save();

    const token = jwt.sign({id:user._id}, config.secret, {expiresIn : 60*60 * 6})
    res.json({ auth: true , token: token});
}

const signIn = async (req, res) => {
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
    const token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 60 * 60 *6,
    });
    res.status(200).json({ auth: true, token });
  };

module.exports={
    signUp,
    signIn
}