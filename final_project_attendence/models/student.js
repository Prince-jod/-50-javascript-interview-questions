const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Student = sequelize.define("Student", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false
  },

  rollNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },

  section: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = Student;