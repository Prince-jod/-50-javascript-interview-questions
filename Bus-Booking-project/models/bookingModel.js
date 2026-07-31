const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");

const Booking = sequelize.define("Booking", {
    seatNumber: DataTypes.INTEGER,
    journeyDate: DataTypes.DATEONLY
});

module.exports = Booking;