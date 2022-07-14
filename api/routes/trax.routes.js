var express = require('express')
var router = express.Router()

var traxController = require('../controllers/trax.controller')

router.route('/get/trax').get(traxController.getAllTrax);

module.exports = router