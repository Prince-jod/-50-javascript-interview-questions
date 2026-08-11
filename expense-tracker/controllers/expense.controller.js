const Expense = require("../models/Expense");
const { categorizeExpense } = require("../services/geminiService");
const createExpense = async (req, res) => {
  try {
    const { title, amount, category, date,name } = req.body;
    const userId = req.user.id; // comes from the verified token, not the body

    if (!title || !amount || !date) {
      return res.status(400).json({
        message: "Title, amount and date are required",
      });
    }

    const expense = await Expense.create({
      userId,
      title,
      amount,
      category,
      date,
      name,
    });

    return res.status(201).json({
      message: "Expense added successfully",
      expense,
    });
  } catch (error) {
    console.error("Create Expense Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const getAllExpenses = async (req, res) => {
  try {
    const userId = req.user.id;

    // Only this user's own expenses — never anyone else's.
    const expenses = await Expense.findAll({
      where: { userId },
      order: [["date", "DESC"]],
    });

    return res.status(200).json({
      message: "Expenses fetched successfully",
      expenses,
    });
  } catch (error) {
    console.error("Get Expenses Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const getExpenseById = async (req, res) => {
  try {
    const { id } = req.params;

    const expense = await Expense.findByPk(id);

    if (!expense) {
      return res.status(404).json({
        message: "Expense does not exist",
      });
    }

    // Ownership check — a user can only view their own expense.
    if (expense.userId !== req.user.id) {
      return res.status(403).json({
        message: "You are not allowed to access this expense",
      });
    }

    return res.status(200).json({
      message: "Expense exists",
      expense,
    });
  } catch (error) {
    console.error("Get Expense Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const expense = await Expense.findByPk(id);

    if (!expense) {
      return res.status(404).json({
        message: "Expense does not exist",
      });
    }

    // Ownership check — a user can only update their own expense.
    if (expense.userId !== req.user.id) {
      return res.status(403).json({
        message: "You are not allowed to update this expense",
      });
    }

    const { title, amount, category, date } = req.body;

    await expense.update({ title, amount, category, date });

    return res.status(200).json({
      message: "Expense updated successfully",
      expense,
    });
  } catch (error) {
    console.error("Update Expense Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const expense = await Expense.findByPk(id);

    if (!expense) {
      return res.status(404).json({
        message: "Expense does not exist",
      });
    }

    // Ownership check — a user can only delete their own expense.
    if (expense.userId !== req.user.id) {
      return res.status(403).json({
        message: "You are not allowed to delete this expense",
      });
    }

    await expense.destroy();

    return res.status(200).json({
      message: "Expense deleted successfully",
    });
  } catch (error) {
    console.error("Delete Expense Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  createExpense,
  getAllExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
};
