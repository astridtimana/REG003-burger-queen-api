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

module.exports={
    signUp
}