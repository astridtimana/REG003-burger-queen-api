const User = require('../models/Users')


const getUser = (req, res) => {
  let userId = req.params.userId

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


const saveUser= (req, res) => {
  console.log('POST/api/user')
  console.log(req.body)

  let user = new User()
  user.email = req.body.email
  user.password = req.body.password
  user.roles.admin = req.body.roles.admin

  user.save((err, userStored) => {
    if (err) res.status(500).send({message:`Error al salvar en la base de datos`})

    res.status(200).send({user: userStored })
  })
}

const updatUser = (req, res) => {
  let userId = req.params.userId
  let update = rep.body

  User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
    if (err) res.status(500).send({message:`Error al actualizar el usuario`})

    res.status(200).send({ user: userUpdated })
  })
} //MANEJO DE STATUS



const deleteuser = (req, res) => {
  let userId = req.params.userId 

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
