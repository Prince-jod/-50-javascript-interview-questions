const express = require("express");

const {
  getStudentsForAttendance
} = require("../controllers/attendance.controller");

const router = express.Router();

router.get("/students", getStudentsForAttendance);

module.exports = router;