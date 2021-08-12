const mongoose = require('mongoose')
const service = require('../services')
const User = require('../models/Users')

function signUp(req,res){
    const {email, password, roles} = req.body;
    const user = new User({
        email: email,
        password: password,
        roles: roles
    });

    user.save((err)=>{
        if(err) return res.status(500).send({message: `Error: ${err}`})

        return res.status(201).send({token: service.createToken(user)})
     })
}

function signIn(req, res){
   User.find({email:req.body.email}, (err,user)=>{
       if(err) return res.status(500).send({message:err})
       if(!user) return res.status(404).send({message:`No existe este usuario`})
       req.user=user
       res.status(200).send({
           message: `Te has logueado correctamente`,
           token: service.createToken(user)
       })
   })

}

module.exports ={
    signUp,
    signIn,
}