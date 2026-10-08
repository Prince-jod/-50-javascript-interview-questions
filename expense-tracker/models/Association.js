const User = require("./User");
const Expense = require("./Expense");
const Order = require("./Order");
const ForgetPassword = require("./ForgetPassword");

// User <-----> Expense

User.hasMany(Expense, {
  foreignKey: "userId",
});

Expense.belongsTo(User, {
  foreignKey: "userId",
});

// User <-----> Order

User.hasMany(Order, {
  foreignKey: "userId",
});

Order.belongsTo(User, {
  foreignKey: "userId",
});

// User <-----> ForgetPassword

User.hasMany(ForgetPassword, {
  foreignKey: "userId",
});

ForgetPassword.belongsTo(User, {
  foreignKey: "userId",
});

module.exports = {
  User,
  Expense,
  Order,
  ForgetPassword,
};