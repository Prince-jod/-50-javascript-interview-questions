const {DataTypes}=require('sequelize');


const sequelize=require('../config/db');

const Student=sequelize.define("Student",{
  id:{
    type:DataTypes.INTEGER,
    autoIncrement:true,
    primaryKey:true,
  },
  name:{
    type:DataTypes.STRING(30),
    allowNull:false,
    validate:{
      notEmpty:true
    }
  },
  rollNumber:{
    type:DataTypes.STRING(200),
    allowNull:false,
    unique:true,
    validate:{
      notEmpty:false
    }
  },
  section: {
      type: DataTypes.STRING(10),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
      
    email: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
     phone: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    

},
  {
    tableName: "students",
    timestamps: true,
  }
);
module.exports=Student;