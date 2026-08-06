const Expense = require("../models/Expense");

// GET /api/expenses
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.findAll({
      where: { userId: req.userId },
      order: [["date", "DESC"]],
    });
    res.json(expenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching expenses" });
  }
};

// POST /api/expenses
exports.createExpense = async (req, res) => {
  try {
    const { title, amount, category, date, notes } = req.body;

    if (!title || amount === undefined) {
      return res.status(400).json({ message: "Title and amount are required" });
    }

    const expense = await Expense.create({
      title,
      amount,
      category,
      date: date || new Date(),
      notes,
      userId: req.userId,
    });

    res.status(201).json(expense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error creating expense" });
  }
};

// PUT /api/expenses/:id
exports.updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    const { title, amount, category, date, notes } = req.body;
    await expense.update({
      title: title ?? expense.title,
      amount: amount ?? expense.amount,
      category: category ?? expense.category,
      date: date ?? expense.date,
      notes: notes ?? expense.notes,
    });

    res.json(expense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error updating expense" });
  }
};

// DELETE /api/expenses/:id
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    await expense.destroy();
    res.json({ message: "Expense deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error deleting expense" });
  }
};
