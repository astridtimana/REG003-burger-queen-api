const User = require('../models/Users');
const jwt = require('jsonwebtoken');
const objectId = require('mongoose').Types.ObjectId ; // es un schemaType de objectId de mongoose
const bcrypt = require('bcrypt');
const {linkHeader }= require('../helper')

const getUser = async(req, res, next) => {
  try {
    let userId = req.params.uid;
    let response = null;

    // identificamos si el params es objectId o email
    if(objectId.isValid(userId)){
      if(!req.decoded.roles.admin && req.decoded.id !== userId){
        return next(403) 
      }
       response = await User.findById(userId)
    } else{  
      if(!req.decoded.roles.admin && req.decoded.email !== userId){return next(403)}
       response = await User.findOne({ email: userId });
    }
    if (!response) { return next(404) }
    return res.status(200).send(response)
  } catch (error) { return res.status(404).send('No existe usuario') }
}

const getUsers = async (req, res) => {
    try {
      // console.log(req.protocol) HTTP
      // console.log(req.path) ENDPOINT
      //console.log(req.get('host')) LOCALHOST

      const limit = parseInt(req.query.limit,10) || 10;
      
      const page = parseInt(req.query.page,10) || 1;
     
      const response =await User.paginate({}, {limit,page})
      
      const url = `${req.protocol}://${req.get('host') + req.path}`;
     
      const links = linkHeader(limit, page, response.totalPages , url, response);
     
      res.links(links)
      return res.status(200).json(response.docs)

    }  catch (error) { 
      return res.status(404).send('No existe usuario') }

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
    let regEx = /\S+@\S+/
    !regEx.test(req.body.email) && next(400)
    
    if(!email || !password){ return res.status(400).send({message:'No hay password ni contraseña'})}
    if(password.length<4){ return res.status(400).send('Contraseña inválida') }
    // user.password = await user.encryptPassword(password); 

    const userValidated =  User.findOne({email:email});
    userValidated.then((doc) => { if(doc){ return next(403) }})

    const response = await user.save();
    const finalResponse = await User.findOne({email: response.email}).select('-password');
    res.status(200).send(finalResponse)
  } catch (error) {
    return next(404);
  }
}

const updateuser = async (req, res, next) => {

  try {
    const userId = req.params.uid
    const update = req.body

    let response = null;


    if(objectId.isValid(userId)){
      !req.decoded.roles.admin && req.decoded.id !== userId && next(403) 
      Object.keys(user).length == 0 && next(400)
      response = User.findByIdAndUpdate(userId, {$set: update}, { new: true, useFindAndModify: false});
    
    } else {
      if(req.decoded.roles.admin){  
        const validEmail = await User.findOne({email: userId });
        !validEmail && next(404)
      }else{
        req.decoded.email !== userId && next(403) 
        req.decoded.email === userId && req.body.roles && next(403)
      }
      if(Object.keys(update).length == 0){return next(400)}

      response =await User.findOneAndUpdate({email: userId}, {$set: update}, { new: true, useFindAndModify: false});
    } 
    !response && next(403) 

    return res.status(200).send(response)

  } catch (error) {
    next(404)
  }

} //MANEJO DE STATUS

const deleteuser = async(req, res,next) => {
  try {
    let userId = req.params.uid;
    let response = null;

    // identificamos si el params es objectId o email
    if(objectId.isValid(userId)){

      if(!req.decoded.roles.admin && req.decoded.id !== userId){return next(403)}
        response = await User.findById(userId)
    } else{
      if(!req.decoded.roles.admin && req.decoded.email !== userId ){
        return next(403)
      }
        response = await User.findOne({ email: userId })
    }
      response.remove()
      if (!response) { return next(404) }
    return res.status(200).send(response)
   } catch (error) { return res.status(404).send('No existe usuario') }
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
