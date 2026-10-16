const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");

require("dotenv").config();

const caPath = path.join(__dirname, "..", "certs", "ca.pem");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    dialect: process.env.DB_DIALECT,
    dialectOptions: {
      ssl: {
        ca: fs.readFileSync(caPath),
        rejectUnauthorized: true,
      },
    },
    logging: false,
  }
);

module.exports = sequelize;