const User = require('../models/Users')
const jwt = require('jsonwebtoken')
const config = require('../config')

const getUser = async(req, res) => {
  let userId = req.params.uid

  if (!req.decoded.roles.admin) {
    return res.status(403).send({message:'No es usuario admin'})
  }
  const emailValided = await User.findOne({ email: userId });
  if (emailValided) {
    return res.status(200).end(JSON.stringify( emailValided.email))
  }

   User.findById(userId, (err, user)=>{
    if (err) return res.status(404).send({message:`Error en la petición userID`})

    //res.status(200).send({ user })
    //return res.status(200).end(JSON.stringify( user.email))
  })
  // BUSCAR PAGINATION
  // MANEJO DE STATUS
}

const getUsers = (req, res) => {
  User.find({}, (err, users) => {
    if (err) return res.status(500).send({message: `Error en la petición colecctionUsers`})
    if (!users) return res.status(404).send({message:`No existen usuarios`})

    // return res.send(200, { users })
    return res.end(JSON.stringify(users))
  })

} //FALTA HEADER PARAMETERS, QUERY PARAMETERS Y MANEJO DE STATUS


const saveUser= async(req, res, next) => {
  const {email, password, roles} = req.body;
  const user = new User({
      email : email,
      password : password,
      roles: roles
  })

  if(!email || !password){ return res.status(400).send({message:'No hay password ni contraseña'})}
    // encrypt the user's password
    // si el password es menor que (antes de guardar)//
    if(password.length<6){
      return res.status(400).send('Contraseña inválida')
    }
  user.password = await user.encryptPassword(password);

    // const userValidated = User.findOne({email:req.body.email});
    // if(userValidated){return res.status(400).send('correo ya existe')}

    const userValidated =  User.findOne({email:email});
    userValidated.then((doc) => {
      if (doc) {
        return next(403);
      }
  
      user.save();
      const token = jwt.sign({id:user._id, roles:user.roles}, config.secret, {expiresIn : 60*60 * 6})
      res.json({ auth: true , token: token});
      })
      .catch((err) => {
          console.info('Ha ocurrido un error, user-controller', err);
      });
  
    //next();
    
  //   await user.save((err) => {
  //   if (err) res.status(400).send({message:`Error al salvar en la base de datos`})
  //   //si no hay email o password (status: 400)
  //   const token = jwt.sign({id:user._id, roles:user.roles}, config.secret, {expiresIn : 60*60 * 6})
  //   res.json({ auth: true , token: token});
  //   //res.status(200).send({user: userStored  })
  // })
}

const updatUser = (req, res) => {
  let userId = req.params.uid
  let update = rep.body

  User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
    if (err) res.status(500).send({message:`Error al actualizar el usuario`})

    res.status(200).send({ user: userUpdated })
  })
} //MANEJO DE STATUS



const deleteuser = async(req, res) => {
  let userId = req.params.uid 

  if (!req.decoded.roles.admin) {
    return res.status(403).send({message:'No es usuario admin'})
  }
  const emailValided = await User.findOne({ email: userId });
  console.log(req.decoded)
  if (emailValided) {
    return res.status(200).end(JSON.stringify( emailValided.email))
  }

   User.findById(userId, (err, user)=>{
   // console.log(user)
    if (err) return res.status(404).send({message:`Error en la petición userID`})

    //res.status(200).send({ user })
    user.remove(err => {
      if (err) res.status(500).send({message:`Error al borrar el usuario`})
      //res.status(200).send({message:`El usuario ha sido eliminado`})
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
