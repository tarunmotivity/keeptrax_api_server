var express = require('express')
var router = express.Router()

var authenticationController = require('../controllers/authentication.controller')

router.route('/').get(authenticationController.appTest);
router.route('/signup').post(authenticationController.signup)
router.route('/getOrganization').get(authenticationController.getOrganizations)


module.exports = router
