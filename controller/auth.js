const mongoose = require('mongoose')
const service = require('../services')
const User = require('../models/user')

function signUp(req,res){
    const user = new User({
        email: req.body.email,
        password:req.body.password,
        admin: req.body.roles.admin
    })

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