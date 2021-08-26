const Order = require("../models/Orders");
const { 
isEmptyObj
} = require("../helper");

const getOrder = async (req, res, next) => {
  try {
    let orderId = req.params.orderId;
    let response = await Order.findById(orderId);
    let finalResponse = await response
      .populate("products.product")
      .execPopulate();

    res.status(200).send(finalResponse);
  } catch (error) {
    return next(404);
  }
};

const getOrders = (req, res) => {
  Order.find({}, (err, orders) => {
    if (err)
      return res
        .status(500)
        .send({ message: `Error en la petición colecctionOrders` });
    if (!orders) return res.status(404).send({ message: `No existen órdenes` });

    res.status(200).send(orders);
  });
};

const saveOrder = async (req, res, next) => {
  try {
    const { userId, client, products, status } = req.body;

    if (isEmptyObj(req.body) || products.length == 0) {
      return next(400);
    }

    let order = new Order({
      userId: userId,
      client: client,
      products: products.map((product) => ({
        qty: product.qty,
        product: product.productId,
      })),
      status: status || "pending",
    });

    let response = await order.save();

    const finalResponse = await response
      .populate("products.product")
      .execPopulate();

    return res.status(200).send(finalResponse);
  } catch (error) {
    return next(404);
  }
};

const updateOrder = async (req, res, next) => {
  try {
    let orderId = req.params.orderId;
    let update = req.body;

    const orderUpdate = await Order.findByIdAndUpdate(
      orderId,
      { $set: update },
      { new: true, useFindAndModify: false }
    );

    switch (update.status) {
      case "pending":
      case "canceled":
      case "delivering":
      case "delivered":
      case "preparing":
        break;

      default:
        next(400);
        break;
    }

    if (isEmptyObj(update)) {
      return next(400);
    }

    res.status(200).send(orderUpdate);
  } catch (error) {
    return next(404);
  }
};

const deleteOrder = async (req, res, next) => {
  try {
    let orderId = req.params.orderId;

    const response = await Order.findById(orderId);

    const finalResponse = await response.remove();

    return res.status(200).send(finalResponse);
  } catch (error) {
    return next(404);
  }
};

module.exports = {
  getOrder,
  getOrders,
  saveOrder,
  updateOrder,
  deleteOrder,
};
