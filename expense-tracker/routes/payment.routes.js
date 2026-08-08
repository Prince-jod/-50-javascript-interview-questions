const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const {
    createOrder,
    verifyPayment
} = require("../controllers/payment.controller");
router.post("/create-order", authMiddleware, createOrder);
router.post(
    "/verify",
    authMiddleware,
    verifyPayment
);

module.exports = router;