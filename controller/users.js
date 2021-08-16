const User = require('../models/Users')
const jwt = require('jsonwebtoken')
const config = require('../config')

const getUser = (req, res) => {
  let userId = req.params.uid
  
  User.findById(userId, (err, user)=>{
    if (err) return res.status(500).send({message:`Error en la petición userID`})
    if (!user) return res.status(404).send({message:`No usuario no existe`})

    res.status(200).send({ user })
  })
  // BUSCAR PAGINATION
  // MANEJO DE STATUS
}

const getUsers = (req, res) => {
  User.find({}, (err, users) => {
    if (err) return res.status(500).send({message: `Error en la petición colecctionUsers`})
    if (!users) return res.status(404).send({message:`No existen usuarios`})

    res.send(200, { users })
  })
} //FALTA HEADER PARAMETERS, QUERY PARAMETERS Y MANEJO DE STATUS


const saveUser= async(req, res) => {
  const {email, password, roles} = req.body;
  const user = new User({
      email : email,
      password : password,
      roles: roles
  })
    // encrypt the user's password
    user.password = await user.encryptPassword(password);

    await user.save((err) => {
    if (err) res.status(500).send({message:`Error al salvar en la base de datos`})
    //si no hay email o password (status: 400)

    const token = jwt.sign({id:user._id, roles:user.roles}, config.secret, {expiresIn : 60*60 * 6})
    res.json({ auth: true , token: token});

    //res.status(200).send({user: userStored  })
  })


}

const updatUser = (req, res) => {
  let userId = req.params.uid
  let update = rep.body

  User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
    if (err) res.status(500).send({message:`Error al actualizar el usuario`})

    res.status(200).send({ user: userUpdated })
  })
} //MANEJO DE STATUS



const deleteuser = (req, res) => {
  let userId = req.params.uid 

  User.findById(userId, (err, user) => {
    if (err) res.status(500).send({message:`Error al borrar al usuario`}) // COMO MANEJAR LOS STATUS 401,403,404

    user.remove(err => {
      if (err) res.status(500).send({message:`Error al borrar el usuario`})
      res.status(200).send({message:`El usuario ha sido eliminado`})
    })
  })
}

 module.exports = {
  getUser,
  getUsers,
  saveUser,
  deleteuser,
  updatUser
}
// module.exports = {
//   getUsers: (req, resp, next) => {
//   },
// };
