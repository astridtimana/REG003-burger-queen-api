const { Schema, model } = require('mongoose');

const orderSchema = new Schema({
  
    userId: {
      type: String,
      required: true,
    },
    client: {
      type: String,     
      //required: true,
    },
    products: [{
      qty: { type: Number},
      productId: {
         type: Schema.Types.ObjectId, 
         ref: 'Products',
        required: true,
      }
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
      default: Date.now(),
      required:false
    }
});

module.exports = model('Orders', orderSchema);