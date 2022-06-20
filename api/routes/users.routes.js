var express = require('express')
var router = express.Router()

var userController = require('../controllers/users.controller')

router.route('/getAllUsers').get(userController.getAllUsers);



module.exports = router