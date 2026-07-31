const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");

const Bus = sequelize.define("Bus", {
    busName: DataTypes.STRING,
    source: DataTypes.STRING,
    destination: DataTypes.STRING,
    totalSeats: DataTypes.INTEGER,
    availableSeats: DataTypes.INTEGER
});

module.exports = Bus;