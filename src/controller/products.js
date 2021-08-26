const Product = require("../models/Products");
const { 
  isEmptyObj
  } = require("../helper");
  const { isAdmin } = require("../middleware/auth");
   
const getProduct = (req, res, next) => {
  let productId = req.params.productId;
  Product.findById(productId, (err, product) => {
    if (err)
      return res
        .status(404)
        .send({ message: `Error en la petición productID` });
    if (!product)
      return res.status(404).send({ message: `No producto no existe` });

    res.status(200).send(product);
  });
};

const getProducts = (req, res, next) => {
  Product.find({}, (err, products) => {
    if (err)
      return res
        .status(404)
        .send({ message: `Error en la petición colecctionProducts` });
    if (!products)
      return res.status(404).send({ message: `No existen productos` });

    return res.status(200).send(products);
  });
};

const saveProduct = async (req, res, next) => {
  try {
    let reqBody = req.body;

    let product = new Product(reqBody);

    let response = null;

    if (isEmptyObj(reqBody)) {
      return next(400);
    }

    if (isAdmin(req)) {
      response = await product.save();
      res.status(200).json(response);
    }
  } catch (error) {
    return next(404);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    let productId = req.params.productId;
    let update = req.body;
    if (typeof update.price !== "number") {
      return next(400);
    }

    const productUpdate = await Product.findByIdAndUpdate(
      productId,
      { $set: req.body },
      { new: true, useFindAndModify: false }
    );
    res.status(200).send(productUpdate);
  } catch (error) {
    return next(404);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    let productId = req.params.productId;
    let response = null;

    response = await Product.findOne({ _id: productId });
    if (!isAdmin(req) && !response) {
      return next(404);
    }

    response.deleteOne();

    if (!response) {
      return next(404);
    }
    res.status(200).send(response);
  } catch (error) {
    return next(404);
  }
};

module.exports = {
  getProduct,
  getProducts,
  saveProduct,
  deleteProduct,
  updateProduct,
};
