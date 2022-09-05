var express = require('express')
var router = express.Router()

var adminController = require('../controllers/admin.controller')

// router.route('/organization').post(adminController.addOrganization)
router.route('/getAllOrganizations').get(adminController.getOrganization); // Not using
router.route('/addAdmin').post(adminController.addAdmin);
router.route('/teams').post(adminController.addTeams);
router.route('/teams').get(adminController.getTeams);

router.route('/add/team/memebr').post(adminController.addTeamMember)
router.route('/organizations').put(adminController.updateOrganization)
router.route('/applications').put(adminController.updateApplication)
router.route('/teams').put(adminController.updateTeam)

module.exports = router;
