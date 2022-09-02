var express = require('express')
var router = express.Router()

var adminController = require('../controllers/admin.controller')

// router.route('/organization').post(adminController.addOrganization)
router.route('/getAllOrganizations').get(adminController.getOrganization)
router.route('/addAdmin').post(adminController.addAdmin)
router.route('/addTeams').post(adminController.addTeams)

module.exports = router;
