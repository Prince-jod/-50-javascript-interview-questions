const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Order = sequelize.define("Order", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  orderId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },

  status: {
    type: DataTypes.ENUM("PENDING", "SUCCESSFUL", "FAILED"),
    defaultValue: "PENDING",
    allowNull: false,
  },
});

module.exports = Order;