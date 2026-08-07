const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/auth.middleware");
const {
  markAttendence,
  getAllAttendence,
  updateAttendence,
  deleteAttendence,
} = require("../controllers/attendence.controller");

router.use(verifyToken);

router.post("/", markAttendence);
router.get('/',getAllAttendence);
router.put("/:id", updateAttendence);
router.delete("/:id", deleteAttendence);

module.exports = router;
