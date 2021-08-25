const Order = require('../models/Orders')

const getOrder = async (req, res) => {
  try {
    let orderId = req.params.orderId
      let response = await Order.findById(orderId)
      console.log(response)
      let finalResponse = await response
        .populate('products.product')
        .execPopulate()
    
      // await Order.findById(orderId, (err, order)=>{
      //   if (err) return res.status(404).send({message:`Error en la petición orderID`})
      //   if (!order) return res.status(404).send({message:`Order no existe`})

      //   let response =  order.populate('products.product')
      //     //.execPopulate()
      //        // console.log(order.products[1].product.name); // sí muestra en el post
        res.status(200).send( finalResponse )
      //  })
   
  } catch (error) {
    return res.status(404).send('Error')
  }
}

const getOrders = async (req, res) => {
  try {
    Order.find({}, (err, orders) => {
      if (err) return res.status(500).send({message: `Error en la petición colecctionOrders`})
      if (!orders) return res.status(404).send({message:`No existen órdenes`})

      res.send(200,  orders )
    })
  } catch (error) {
    return res.status(404).send('Error')
  }   
}

const saveOrder= async (req, res,next) => {
  try {
    const {userId, client, products, status } = req.body

    if(Object.keys(req.body).length == 0 || 
    req.body.products.length == 0 ){return next(400)}

    let order = new Order({
      userId: userId,
      client: client,
      products: products.map((product) => ({
        qty: product.qty,
        product: product.productId
      })),  
      status : status||'pending'
    })

     let response = await order.save();

    const finalResponse = await response.populate('products.product')
    .execPopulate()

    let responseFinaSave = await order.save();

    // console.log('49', finalResponse)
    // console.log('49', finalResponse.products)


    return res.status(200).send(finalResponse)

  } catch (error) {
    console.log('60');
    return res.status(404).send('Error')
  }
}

const updateOrder = async (req, res, next) => {
  try {
    let orderId = req.params.orderId
    let update = req.body
    //console.log(64)

    const orderUpdate= await Order.findByIdAndUpdate(
      orderId,
      { $set: update},
      { new: true, useFindAndModify: false }
    )
    //console.log(71)

   // if(update.status!=='pending'||update.status!=='canceled'||update.status!=='delivering'||update.status!=='delivered'||update.status!=='preparing'){ return next(400)}
  //  switch (update.status) {
  //    case !'pending':
  //    case !'canceled':
  //    case !'delivering':
  //    case !'delivered':
  //    case !'preparing':
  //       next(400)
  //     break;
   
  //    default:
  //     next(200)
  //      break;
  //  }

    //console.log(74)

    if(Object.keys(update).length == 0){ return next(400)}
    //console.log(77)

    res.status(200).send(orderUpdate)
  } catch (error) {
    return res.status(404).send('Error')
  }
  
}

const deleteOrder = async (req, res, next) => {
  try {
    let orderId = req.params.orderId

    await Order.findById(orderId, (err, order) => {
    if (err) res.status(404).send({message:`Error al borrar la order`})

    order.remove(err => {
      if (err) res.status(404).send({message:`Error al borrar la order`})
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