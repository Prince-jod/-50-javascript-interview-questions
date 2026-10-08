const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ForgetPassword = sequelize.define(
  "ForgetPassword",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "ForgetPasswords",
    timestamps: true,
  }
);

module.exports = ForgetPassword;