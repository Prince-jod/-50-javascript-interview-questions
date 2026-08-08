const User = require('./User');
const Expense = require('./Expense');
const Order = require("./Order");
// user <-----> expense
User.hasMany(Expense, {
  foreignKey: "userId",
});

Expense.belongsTo(User, {
  foreignKey: "userId",
});
User.hasMany(Order, {
  foreignKey: "userId",
});

Order.belongsTo(User, {
  foreignKey: "userId",
});

module.exports = {
  User,
  Expense,
  Order,
};
