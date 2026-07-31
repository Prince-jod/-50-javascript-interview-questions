const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");

const Student = sequelize.define("Student", {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true
    },
    age: {
        type: DataTypes.INTEGER
    }
});

module.exports = Student;