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
      product: { type: Object },

    }],
    status: {
      type: String,
    },
    dateEntry: {
      type: Date,
      default: Date.now,
    },
    dateProcessed: {
      type: Date,
      default: Date.now,
    }
});

module.exports = model('Orders', orderSchema);