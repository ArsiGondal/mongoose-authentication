const express = require('express');
const userController = require('./../controllers/userController');
const router = express.Router();

router.post('/signup' , userController.signup);
router.post('/login' , userController.login);
router.get('/logout' , userController.logout);
router.route('/getAll').get(userController.protect,userController.restrictTo('manager'), userController.getAll);

module.exports = router;