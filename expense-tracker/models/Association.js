const User = require('./User');
const Expense = require('./Expense');

// user <-----> expense
User.hasMany(Expense, {
  foreignKey: "userId",
});

Expense.belongsTo(User, {
  foreignKey: "userId",
});

module.exports = {
  User,
  Expense,
};
