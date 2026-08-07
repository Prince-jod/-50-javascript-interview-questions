const { DataTypes } = require('sequelize'); // we imported the datatypes so we can give needed datatype according to the table constraints and type

// here we are importing the database because we want to set in which database table this needs to be saved on
const sequelize = require('../config/db');

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: true,
    }
  },
  email: {
    type: DataTypes.STRING(300),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      notEmpty: true,
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
    tableName: "users",
    timestamps: true,
  }
);

module.exports = User;
