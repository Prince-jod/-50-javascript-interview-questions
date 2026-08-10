const express = require("express");

const {
  getStudentsForAttendance,
  markAttendance,
  getAttendanceReport
} = require("../controllers/attendance.controller");

const router = express.Router();

router.get("/", getStudentsForAttendance);

router.post("/", markAttendance);

router.get("/report", getAttendanceReport);

module.exports = router;