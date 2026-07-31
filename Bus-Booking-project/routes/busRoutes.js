const express = require("express");
const router = express.Router();

const {
    addBus,
    getAvailableBuses
} = require("../controllers/busController");

router.post("/", addBus);
router.get("/available/:seats", getAvailableBuses);

module.exports = router;