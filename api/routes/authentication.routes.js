var express = require('express')
var router = express.Router()

var authenticationController = require('../controllers/authentication.controller')

router.route('/').get(authenticationController.appTest);
router.route('/signup').post(authenticationController.signup)
router.route('/getOrganization').get(authenticationController.getOrganizations)
router.route('/api/v2.0.1/users/login').post(authenticationController.login);

module.exports = router
