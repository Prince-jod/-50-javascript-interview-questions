const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/auth.middleware");
const {
  markAttendence,
  getAllAttendence
} = require("../controllers/attendence.controller");

router.use(verifyToken);

router.post("/", markAttendence);
router.get('/',getAllAttendence);

module.exports = router;
