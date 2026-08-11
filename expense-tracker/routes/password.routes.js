


const express = require("express");
const router = express.Router();

const { forgotPassword } = require("../controllers/password.controller");

router.post("/forgotpassword", forgotPassword);

module.exports = router;