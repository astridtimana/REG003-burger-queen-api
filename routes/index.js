const auth = require('./auth');
const users = require('./users');
const products = require('./products');
const orders = require('./orders');

const Users = require('../models/Users')
const express = require('express');
const orderCtrl = require('../controller/orders') 
const UserCtrl = require('../controller/users') 
const ProductCtrl = require('../controller/products')
const authCtrl = require('../controller/authController')
// ******************
const app = express();

const root = (app, next) => {
  const pkg = app.get('pkg');
  app.get('/', (req, res) => res.json({ name: pkg.name, version: pkg.version }));
  /********** Orders  *********/
  app.get('/getOrders', orderCtrl.getOrders)
  app.get('/getOrders/:orderId', orderCtrl.getOrder)  
  app.post('/createOrder', orderCtrl.saveOrder) 
  app.put('/updateOrder/:orderId', orderCtrl.updateOrder) 
  app.delete('/deleteOrder/:orderId', orderCtrl.deleteOrder) 

  //USERS
  app.get('/user', UserCtrl.getUsers) 
  app.get('/userId/:userId', UserCtrl.getUser) 
  app.post('/createUser', UserCtrl.saveUser) 
  app.delete('/deleteUser/:userId', UserCtrl.deleteuser)

  //PRODUCTS
  app.get('/product',ProductCtrl.getProducts)
  app.get('/product/:productId',ProductCtrl.getProduct)
  app.post('/product',ProductCtrl.saveProduct)
  app.delete('/product/:productId',ProductCtrl.deleteProduct)
  app.put('/product/:productId',ProductCtrl.updateProduct)

  app.post('/signup',authCtrl.signUp )

  app.all('*', (req, resp, nextAll) => nextAll(404));
  return next();
};

// eslint-disable-next-line consistent-return
const register = (app, routes, cb) => {
  if (!routes.length) {
    return cb();
  }

  routes[0](app, (err) => {
    if (err) {
      return cb(err);
    }
    return register(app, routes.slice(1), cb);
  });
};

module.exports = (app, next) => register(app, [
  auth,
  users,
  products,
  orders,
  root,
], next);
