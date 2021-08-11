const auth = require('./auth');
const users = require('./users');
const products = require('./products');
const orders = require('./orders');

const Users = require('../models/Users')
const express = require('express');
const ProductCtrl = require('../controller/users') //add_carlaDev
const orderCtrl = require('../controller/orders') //add_carlaDev
const prtCtrl = require('../controller/products') //add_carlaDev



// ******************
const app = express();

const root = (app, next) => {
  const pkg = app.get('pkg');
  app.get('/', (req, res) => res.json({ name: pkg.name, version: pkg.version }));
  /*******************/
  app.get('/user', ProductCtrl.getUsers) 
  app.post('/createUser', ProductCtrl.saveUser) 
  app.delete('/deleteuser/:userId', ProductCtrl.deleteuser) 
  app.get('/user/:userId', ProductCtrl.getUser) 
  /********** Orders  *********/
  app.get('/getOrders', orderCtrl.getOrders)
  app.get('/getOrders/:orderId', orderCtrl.getOrder)  
  app.post('/createOrder', orderCtrl.saveOrder) 
  app.put('/updateOrder/:orderId', orderCtrl.updateOrder) 
  app.delete('/deleteOrder/:orderId', orderCtrl.deleteOrder) 

  app.get('/productsxd', prtCtrl.getProducts)


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
