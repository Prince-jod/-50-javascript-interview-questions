const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");

const Payment = sequelize.define("Payment", {
    amount: DataTypes.FLOAT,
    paymentMethod: DataTypes.STRING,
    status: DataTypes.STRING
});

module.exports = Payment;