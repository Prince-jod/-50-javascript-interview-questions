// first we will import sequelize

const { Sequelize } = require('sequelize'); /// imported it so we can make the connection to the database

require('dotenv').config(); // this will help us to read the env file which contains info about database connection

const sequelize = new Sequelize( // here we are telling sequelize which database connection it needs to connect to
  // it takes the db name, user and password as parameter and also an object that contains host info and dialect info

  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  }
);

module.exports = sequelize;
