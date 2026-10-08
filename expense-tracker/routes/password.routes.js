const express = require("express");

const router = express.Router();

const { forgetPassword } = require("../controllers/forgetPassword.controller");

const {
  showResetPasswordForm,
  resetPassword,
} = require("../controllers/resetPassword.controller");


router.post("/forgetpassword", forgetPassword);

router.get("/resetpassword/:id", showResetPasswordForm);

router.post("/resetpassword/:id", resetPassword);


module.exports = router;