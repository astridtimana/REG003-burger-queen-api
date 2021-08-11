const jwt = require('jsonwebtoken');
const config = require('../config')

function createToken(user){

    const token = jwt.sign({id: user._id, email: user-email, admin: user.roles.admin}, config.secret, {expiresIn: 60*60*6})
    return token

}

module.exports = {
    createToken
}