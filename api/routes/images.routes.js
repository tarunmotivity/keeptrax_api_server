const express = require("express");
const router = express.Router();

const controller = require("../controllers/images.controller");

router.get(
    "/api/v2.0.1/users/:id/images",
    controller.getImages
);

module.exports = router;