const express = require("express");
const router = express.Router();

const {
  markAttendence,
} = require("../controllers/attendence.controller");

router.post("/", markAttendence);

module.exports = router;