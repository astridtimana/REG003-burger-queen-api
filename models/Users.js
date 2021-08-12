const mongoose = require('mongoose');
const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new Schema({

  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
    //regexp
    //trim(?)
  },
  roles: {
    admin: {
      type: Boolean,
    },
  },
});

userSchema.pre('save', function(next){

  let user = this
  // if(!user.isModified('password')) return next()

  bcrypt.genSalt(10,(err,salt)=>{
    if(err) return next()
    bcrypt.hash(user.password,salt, null,(err,hash)=>{
      if(err) return next(err)
      user.password=hash
      next()
    })
  })

})

 

module.exports = model('Users', userSchema);
