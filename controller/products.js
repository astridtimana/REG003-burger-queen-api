const Product = require('../models/Products')

const getProduct = (req, res, next) => {
  try{  
    let productId = req.params.productId
    Product.findById(productId, (err, product)=>{
      if (err) return res.status(404).send({message:`Error en la petición productID`})
      if (!product) return res.status(404).send({message:`No producto no existe`})
  
      res.status(200).send({ product })
    })
  } catch (error) { return res.status(404).send('No existe usuario') }
}

const getProducts = (req, res, next) => {
  try{
    Product.find({}, (err, products) => {
      if (err) return res.status(404).send({message: `Error en la petición colecctionProducts`})
      if (!products) return res.status(404).send({message:`No existen productos`})
  
      return res.send(JSON.stringify(products))
    })
  } catch (error) { return res.status(404).send('No existe colleción para productos') }
}


const saveProduct= (req, res, next) => {
  let product = new Product()
  product.name = req.body.name
  product.price = req.body.price
  product.image = req.body.image
  product.type = req.body.type
  product.dateEntry = req.body.dateEntry

  let reqBody = req.body

  if(Object.keys(reqBody).length == 0 ){return next(400)}

  if(req.decoded.roles.admin){
    product.save((err, productStored) => {
      if (err) res.status(500).send({message:`Error al salvar en la base de datos el prpducto`})

      res.status(200).send({product: productStored })
    })
  }
}

const updateProduct = async(req, res,next) => {
  try{
    let productId = req.params.productId
    let update = req.body
    if (typeof update.price !== 'number'){ return next(400)}

    if(Object.keys(reqBody).length == 0 ){return next(400)}

    const productUpdate = await Product.findOneAndUpdate(
      { _id: productId },
      { $set: req.body },
      { new: true, useFindAndModify: false },
    );
    res.status(200).json(productUpdate);
  } catch (error) { return res.status(404).send('No existe usuario') }
}

const deleteProduct = (req, res) => {
  try{
    let productId = req.params.productId

    Product.findById(productId, (err, product) => {
      if (err) res.status(404).send({message:`Error al borrar al producto`})

      product.remove(err => {
        if (err) res.status(404).send({message:`Error al borrar el producto`})
        res.status(200).send({message:`El producto a sido eliminado`})
      })
    })
    res.status(200)
  } catch (error) { return res.status(404).send('No existe usuario') }
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