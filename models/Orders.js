const { Schema, model } = require('mongoose');

const orderSchema = new Schema({
  
    userId: {
      type: String,
      required: true,
    },
    client: {
      type: String,     
      required: true,
    },
    products: [{
      qty: { type: Number},
      product: { type: Object }
    }],
    status: {
      type: String,
    },
    dateEntry: {
      type: Date,
      required:false,
      default: Date.now()
    },
    dateProcessed: {
      type: Date,
      required:false
    }
});

module.exports = model('Orders', orderSchema);