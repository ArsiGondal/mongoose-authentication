const express = require('express');
const productController = require('./../controllers/productController');
const userController = require('./../controllers/userController');
const router = express.Router();

router.route('/').post(userController.protect,userController.restrictTo('admin'), productController.createProduct)
router.route('/').get(userController.protect,userController.restrictTo('admin'), productController.getAll);

module.exports = router;