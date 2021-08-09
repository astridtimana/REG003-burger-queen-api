<<<<<<< HEAD
<<<<<<< HEAD

=======
>>>>>>> 7086a41dc101902ad51fe0476de63f5343d27d4b
=======
>>>>>>> f3e8ea3c95c9e4200937918e77454f42786f44d4
const { Schema, model } = require('mongoose');

const productSchema = new Schema({
  
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,     
      required: true,
    },
    image: {
      type: String,
    },
    type: {
      type: String,
    },
    dateEntry: {
      type: Date,
      default: Date.now,
    },
  
});

module.exports = model('Products', productSchema);