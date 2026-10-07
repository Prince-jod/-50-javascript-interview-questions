const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("testdb", "root", "your_password", {
    host: "localhost",
    dialect: "mysql"
});

sequelize.authenticate()
    .then(() => console.log("Database Connected"))
    .catch(err => console.log(err));

module.exports = sequelize;