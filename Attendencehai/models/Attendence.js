const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Attendance = sequelize.define(
  "Attendance",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    teacherId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("Present", "Absent", "Leave"),
      allowNull: false,
    },
  },
  {
    tableName: "attendance",
    timestamps: true,

    indexes: [
      {
        unique: true,
        fields: ["studentId", "date"],
      },
    ],
  }
);

module.exports = Attendance;