const bcrypt = require('bcrypt');
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

userSchema.methods.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

module.exports = model('Users', userSchema);
