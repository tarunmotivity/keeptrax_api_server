var express = require('express')
var router = express.Router()

var traxController = require('../controllers/trax.controller')

router.route('/get/trax').get(traxController.getAllTrax);
router.route('/api/v2.0.1/users/:id/trax')
      .get(traxController.getUserTrax);
router.route('/api/v2.0.1/users/:id/trax/search')
    .get(traxController.searchUserTrax);
router.route('/api/v2.0.1/users/:id/trax/:traxId')
    .delete(traxController.deleteTrax);
router.route('/api/v2.0.1/users/:id/places/:placeId/trax/:traxId')
    .put(traxController.updateTrax);
router.route('/api/v2.0.1/users/:id/trax')
    .post(traxController.createTrax);

module.exports = router