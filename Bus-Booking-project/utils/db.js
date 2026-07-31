const {Sequelize}=require('sequelize');

const sequelize=new Sequelize('testdb','root','Prince007@',{
  user:"root",
  dialect:'mysql'
});
sequelize.authenticate()
    .then(() => console.log("Database Connected"))
    .catch(err => console.log(err));

module.exports = sequelize;