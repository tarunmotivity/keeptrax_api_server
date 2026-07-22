const express = require("express");
const router = express.Router();

const controller = require("../controllers/images.controller");
const upload = require("../../helper/upload");

router.post(
    "/api/v2.0.1/users/:id/images",
    upload.single("image"),
    controller.uploadImage
);

router.get(
    "/api/v2.0.1/users/:id/images",
    controller.getImages
);
router.delete(
    "/api/v2.0.1/users/:id/images/:imageId",
    controller.deleteImage
);

module.exports = router;