const { Schema, model } = require('mongoose');

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
      type: Boolean,
  },
});

module.exports = model('Users', userSchema);