var express = require('express')
var router = express.Router()
const { authorizeUser} = require('../../helper/authorization')

var userController = require('../controllers/users.controller')

router.route('/getAllUsers').get(userController.getAllUsers);
router.route('/user').put(userController.updateUser)
router.route('/user').delete(userController.deleteUser)
router.route('/user').post(authorizeUser,userController.addUser);


module.exports = router