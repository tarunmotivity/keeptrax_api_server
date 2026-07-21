const express = require("express");
const router = express.Router();

const controller = require("../controllers/preferenceController");

router.get(
    "/api/v2.0.1/users/:id/preferences",
    controller.getPreferences
);

router.put(
    "/api/v2.0.1/users/:id/preferences",
    controller.updatePreferences
);

module.exports = router;