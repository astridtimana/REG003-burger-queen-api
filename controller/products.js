const Product = require('../models/Products')

const getProduct = (req, res) => {
  let productId = req.params.productId

  Product.findById(productId, (err, product)=>{
    if (err) return res.status(500).send({message:`Error en la petición productID`})
    if (!product) return res.status(404).send({message:`No producto no existe`})

    res.status(200).send({ product })
  })
}

const getProducts = (req, res) => {
    Product.find({}, (err, products) => {
    if (err) return res.status(500).send({message: `Error en la petición colecctionProducts`})
    if (!products) return res.status(404).send({message:`No existen productos`})

    res.send(200, { products })
  })
}


const saveProduct= (req, res) => {
  let product = new Product()
  product.name = req.body.name
  product.price = req.body.price
  product.image = req.body.image
  product.type = req.body.type
  product.dateEntry = req.body.dateEntry

  product.save((err, productStored) => {
    if (err) res.status(500).send({message:`Error al salvar en la base de datos el prpducto`})

    res.status(200).send({product: productStored })
  })
}

const updateProduct = (req, res) => {
  let productId = req.params.productId
  let update = req.body

  Product.findByIdAndUpdate(productId, update, (err, productUpdated) => {
    if (err) res.status(500).send({message:`Error al actualizar el producto`})

    res.status(200).send({ product: productUpdated })
  })
}
const deleteProduct = (req, res) => {
  let productId = req.params.productId

  Product.findById(productId, (err, product) => {
    if (err) res.status(500).send({message:`Error al borrar al producto`})

    product.remove(err => {
      if (err) res.status(500).send({message:`Error al borrar el producto`})
      res.status(200).send({message:`El producto a sido eliminado`})
    })
  })
}

 module.exports = {
  getProduct,
  getProducts,
  saveProduct,
  deleteProduct,
  updateProduct
}
// module.exports = {
//   getUsers: (req, resp, next) => {
//   },
// };
