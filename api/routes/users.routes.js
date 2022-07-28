var express = require('express')
var router = express.Router()

var userController = require('../controllers/users.controller')

router.route('/getAllUsers').get(userController.getAllUsers);
router.route('/user').put(userController.updateUser)
router.route('/user').delete(userController.deleteUser)
router.route('/user').post(userController.addUser);
router.route('/updatePassword').put(userController.updatePassword);


module.exports = router