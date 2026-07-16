var express = require('express')
var router = express.Router()

var traxController = require('../controllers/trax.controller')

router.route('/get/trax').get(traxController.getAllTrax);
router.route('/api/v2.0.1/users/:id/trax')
      .get(traxController.getUserTrax);
router.route('/api/v2.0.1/users/:id/trax/search')
    .get(traxController.searchUserTrax);

module.exports = router