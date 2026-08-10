const express = require("express");

const {
  getStudentsForAttendance,
  markAttendance
} = require("../controllers/attendance.controller");

const router = express.Router();

router.get("/", getStudentsForAttendance);

router.post("/", markAttendance);

module.exports = router;