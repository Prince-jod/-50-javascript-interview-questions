const express = require("express");
const router = express.Router();

const cartController = require("../controllers/cartController");

router.get("/:userId", cartController.getCartForUser);
router.post("/:userId", cartController.addProductToCart);

module.exports = router;