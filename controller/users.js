const User = require('../models/Users')
const jwt = require('jsonwebtoken')
const config = require('../config')
const objectId = require('mongoose').Types.ObjectId // es un schemaType de objectId de mongoose

const getUser = async(req, res, next) => {
  try {
    let userId = req.params.uid;
    let response = null;

    // identificamos si el params es objectId o email
    if(objectId.isValid(userId)){
      !req.decoded.roles.admin && req.decoded.id !== userId 
      ? next(403) 
      : response = await User.findById(userId)
    } else{  
      !req.decoded.roles.admin && req.decoded.email !== userId 
      ? next(403) : response = await User.findOne({ email: userId });
    }
    if (!response) { return next(404) }
    return res.status(200).send(response)
  } catch (error) { return res.status(404).send('No existe usuario') }
  // BUSCAR PAGINATION
}

const getUsers = (req, res) => {
  try {
    User.find({}, (err, users) => {
      if (err) return res.status(500).send({message: `Error en la petición colecctionUsers`})
      if (!users) return res.status(404).send({message:`No existen usuarios`})

      // return res.send(200, { users })
      return res.send(JSON.stringify(users))
    })
  } catch (error) { return res.status(404).send('No existe usuario') }

} //FALTA HEADER PARAMETERS, QUERY PARAMETERS Y MANEJO DE STATUS


const saveUser= async(req, res, next) => {

  try {
    const {email, password, roles} = req.body;
    const user = new User({
        email : email,
        password : password,
        roles: roles
    })
    //console.log(user)
    if(!email || !password){ return res.status(400).send({message:'No hay password ni contraseña'})}
    if(password.length<5){ return res.status(400).send('Contraseña inválida') }
    user.password = await user.encryptPassword(password);

    const userValidated =  User.findOne({email:email});
    userValidated.then((doc) => { if (doc) {
          return next(403);} })

    const response = await user.save();
    const finalResponse = await User.findOne({email: response.email}).select('-password');
    res.status(200).send(finalResponse)
  } catch (error) {
    return next(404);
  }
}

const updateuser = async (req, res, next) => {
  //console.log(req)
  try {
    let userId = req.params.uid
    let update = req.body

    if(!req.decoded.id === userId || !req.decoded.roles.admin){return next(403)}
    
   const prueba = await User.findByIdAndUpdate(userId, {$set: update}, { new: true, useFindAndModify: false});
    //new: retorna objeto modificado 
    //usefindandmodify: deberia reemplazar a findbyidandupdate,mas tb se puede usar como config global


   res.status(200).send(prueba)
  } catch (error) {
    next(404)
  }

} //MANEJO DE STATUS



const deleteuser = async(req, res,next) => {
  let userId = req.params.uid 

  if (!req.decoded.roles.admin) {
    return next(403);
  }
  const emailValided = await User.findOne({ email: userId });
  //console.log(req.decoded)
  if (emailValided) {
    return res.status(200).send(JSON.stringify( emailValided.email))
  }

   User.findById(userId, (err, user)=>{
   // console.log(user)
    if (err) return next(404);

    //res.status(200).send({ user })
    user.remove(err => {
      if (err) res.status(500).send({message:`Error al borrar el usuario`})
      //res.status(200).send({message:`El usuario ha sido eliminado`})
    })
    return res.status(200).send('usuario eliminado')
  })
}

 module.exports = {
  getUser,
  getUsers,
  saveUser,
  deleteuser,
  updateuser
}
// module.exports = {
//   getUsers: (req, resp, next) => {
//   },
// };
