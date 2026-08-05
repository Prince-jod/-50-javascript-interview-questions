const {DataTypes}=require('sequelize');
const sequelize=require('../config/db');


const Teacher=sequelize.define("Teacher",{
  id:{
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true,

  },
  name:{
   type:DataTypes.STRING(200),
   allowNull:false,
   validate:{
    notEmpty:true,
   }
  },
  email:{
    type:DataTypes.STRING(300),
    allowNull:false,
    unique:true,
    validate:{
      idEmail:true,
      notEmpty:true,
    }
  },
  password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    
},
 {
    tableName: "teachers",
    timestamps: true,
  }

);

module.exports=Teacher;