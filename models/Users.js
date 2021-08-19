const bcrypt = require('bcrypt');
const { Schema, model } = require('mongoose');


const userSchema = new Schema({

  email: {
    type: String,
    unique: true,
    required: true,
    //match: [/[\w-\.]+@([\w-]+\.)+[\w-]{2,4}/]
    //match: [/^\S+@\S+\.\S+$/]

  },
  password: {
    type: String,
    required: true,
    // minLength : 5
  },
  roles: {
    admin: {
      type: Boolean
    },
  },
});

userSchema.methods.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

userSchema.methods.comparePassword = function ( password) {
  return bcrypt.compare(password, this.password)
}


module.exports = model('Users', userSchema);
