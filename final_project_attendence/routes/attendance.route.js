const express = require("express");

const {
  getStudentsForAttendance
} = require("../controllers/attendance.controller");

const router = express.Router();

router.get("/", getStudentsForAttendance);

module.exports = router;