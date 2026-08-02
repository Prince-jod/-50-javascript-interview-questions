const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Aadhaar = sequelize.define("Aadhaar", {
  aadhaarNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  dob: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
});

module.exports = Aadhaar;