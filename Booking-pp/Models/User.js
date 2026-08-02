const {DataTypes} =require('sequelize');

const sequelize=require('../config/db');

const User=sequelize.define("User", {
  name:{
    type:DayaTypes.STRING,
    allowNull:false
  },
  email:{
    type:DataTypes.STRING,
    allowNull:false,
    unique:true
  },
  phone:{
   type:DataTypes.INTEGER,
   allowNull:true,
   unique:true
  }
})

module.exports=User