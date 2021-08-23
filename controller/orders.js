const Order = require('../models/Orders')

const getOrder = async (req, res) => {
  try {
    let orderId = req.params.orderId
    if(Object.isVALID(orderId)){
      await Order.findById(orderId, (err, order)=>{
        if (err) return res.status(500).send({message:`Error en la petición orderID`})
        if (!order) return res.status(404).send({message:`Order no existe`})
    
        res.status(200).send({ order })
      })
    }
   
  } catch (error) {
    return res.status(404).send('Error')
  }
  
}

const getOrders = async (req, res) => {
  try {
    Order.find({}, (err, orders) => {
      if (err) return res.status(500).send({message: `Error en la petición colecctionOrders`})
      if (!orders) return res.status(404).send({message:`No existen órdenes`})

      res.send(200, { orders })
    })
  } catch (error) {
    return res.status(404).send('Error')
  }
    
}

const saveOrder= async (req, res,next) => {
  try {
    let order = new Order()
    order.userId = req.body.userId
    order.client = req.body.client
    order.products = req.body.products
    order.status = req.body.status
    // console.log(req.body)


    
    if(Object.keys(req.body).length == 0 || 
    req.body.products.length == 0 ){return next(400)}

    const response = await order.save();
    // console.log('50')
    return res.status(200).send(response)

  } catch (error) {
    console.log('54');
    return res.status(404).send('Error')
  }
 

}

const updateOrder = async (req, res) => {
  try {
    let orderId = req.params.orderId
    let update = req.body

    const orderUpdate= await Order.findByIdAndUpdate(
      orderId,
      { $set: update},
      { new: true, useFindAndModify: false }
    )
    res.status(200).send(orderUpdate)

  } catch (error) {
    return res.status(404).send('Error')
  }
  
}

const deleteOrder = async (req, res) => {
  try {
    let orderId = req.params.orderId

    await Order.findById(orderId, (err, order) => {
    if (err) res.status(500).send({message:`Error al borrar la order`})

    order.remove(err => {
      if (err) res.status(500).send({message:`Error al borrar la order`})
      res.status(200).send({message:`La order a sido eliminada`})
    })
  })
  } catch (error) {
    return res.status(404).send('Error')
  }
  
}

 module.exports = {
  getOrder,
  getOrders,
  saveOrder,
  updateOrder,
  deleteOrder
}
// module.exports = {
//   getUsers: (req, resp, next) => {
//   },
// };