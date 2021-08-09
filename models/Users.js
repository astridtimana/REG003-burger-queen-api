<<<<<<< HEAD
  
=======
>>>>>>> f3e8ea3c95c9e4200937918e77454f42786f44d4
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
<<<<<<< HEAD
    admin: {
      type: Boolean,
    },
  },
});

module.exports = model('Users', productSchema);
=======
      type: Boolean,
  },
});

module.exports = model('Users', userSchema);
>>>>>>> f3e8ea3c95c9e4200937918e77454f42786f44d4
