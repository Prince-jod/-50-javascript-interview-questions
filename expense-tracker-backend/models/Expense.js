const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");

const Expense = sequelize.define(
  "Expense",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "expenses",
    timestamps: true,
  }
);

// One user -> many expenses
User.hasMany(Expense, { foreignKey: "userId", onDelete: "CASCADE" });
Expense.belongsTo(User, { foreignKey: "userId" });

module.exports = Expense;
