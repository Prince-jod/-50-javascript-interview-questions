const {Sequelize}=require('sequelize');

const sequelize=new Sequelize("attendance_db","root","Prince007@",{
  host:"localhost",
  dialect:"mysql",
}
);

module.exports=sequelize;