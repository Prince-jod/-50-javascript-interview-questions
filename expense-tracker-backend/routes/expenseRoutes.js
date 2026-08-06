const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} = require("../controllers/expenseController");

router.use(auth); // every route below requires a valid token

router.get("/", getExpenses);
router.post("/", createExpense);
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);

module.exports = router;
