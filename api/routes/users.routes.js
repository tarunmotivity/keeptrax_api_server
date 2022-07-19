var express = require('express')
var router = express.Router()

var userController = require('../controllers/users.controller')

router.route('/getAllUsers').get(userController.getAllUsers);
router.route('/user').put(userController.updateUser)
router.route('/user').delete(userController.deleteUser)

module.exports = router