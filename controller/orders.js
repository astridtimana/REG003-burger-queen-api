const Order = require('../models/Orders')

const getOrder = (rep, res) => {
  let orderId = req.params.orderId

  Order.findById(orderId, (err, order)=>{
    if (err) return res.status(500).send({message:`Error en la petición orderID`})
    if (!order) return res.status(404).send({message:`Order no existe`})

    res.status(200).send({ order })
  })
}
const getOrders = (req, res) => {
    Order.find({}, (err, orders) => {
    if (err) return res.status(500).send({message: `Error en la petición colecctionOrders`})
    if (!orders) return res.status(404).send({message:`No existen órdenes`})

    res.send(200, { orders })
  })
}
const saveOrder= (req, res) => {
  console.log('POST/api/order')
  console.log(req.body)

  let order = new Order()
  order.userId = req.body.userId
  order.client = req.body.client
  order.products = req.body.products
  order.status = req.body.status
  order.dateEntry = req.body.dateEntry
  order.dateProcessed = req.body.dateProcessed

  order.save((err, orderStored) => {
    if (err) res.status(500).send({message:`Error al salvar en la base de datos el order`})

    res.status(200).send({order: orderStored })
  })
}
const updateOrder = (req, res) => {
  let orderId = req.params.orderId
  let update = rep.body

  Order.findByIdAndUpdate(orderId, update, (err, orderUpdated) => {
    if (err) res.status(500).send({message:`Error al actualizar el order`})

    res.status(200).send({ order: orderUpdated })
  })
}
const deleteOrder = (req, res) => {
  let orderId = req.params.orderId

  Order.findById(orderId, (err, order) => {
    if (err) res.status(500).send({message:`Error al borrar la order`})

    order.remove(err => {
      if (err) res.status(500).send({message:`Error al borrar la order`})
      res.status(200).send({message:`La order a sido eliminada`})
    })
  })
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