const User = require("./User");
const Expense = require("./Expense");
const Order = require("./Order");
const ForgetPasswordRequest = require("./ForgetPasswordRequest");


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


// User <-----> ForgetPasswordRequest

User.hasMany(ForgetPasswordRequest, {
  foreignKey: "userId",
});

ForgetPasswordRequest.belongsTo(User, {
  foreignKey: "userId",
});


module.exports = {
  User,
  Expense,
  Order,
  ForgetPasswordRequest,
};
