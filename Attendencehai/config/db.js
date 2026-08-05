//first we will import sequelize 

const {Sequelize}=require('sequelize');  /// imported it so we can make the connection to the database

require('dotenv').config(); // this will help us to read the env file which contains info about database connection

const sequelize=new Sequelize( //here we are telling to the sequelize that which database connection it needs to be connect providing the cred to te sequelize constructr
  //where it takes the db name ad user and password as paraenter and also a object that contains the host info and dialect info

  process.env.DB_NAME,
  process.env.DB_USER,
  process.env,DB_PASSWORD,
  {
    host:process.env.DB_HOST,
    dialect:process.env.DB_DIALECT,
  }
);

module.exports=sequelize;
