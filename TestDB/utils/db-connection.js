const {Sequelize} =require('Sequelize');

const sequelize=new Sequelize('testdb','root','Prince007@',{
    host:'localhost',
    dialect:'Mysql'
});

(
    async ()=>{
        try{
            sequelize.authenticate();
            console.log("data connetion has een made");
        }
        catch(err){
   console.log(err);
        }
    }
)
();
model.exports=sequelize;







































// const mysql = require("mysql2");

// const db = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "Prince007@",
//     database: "testdb"
// });

// db.connect((err) => {
//     if (err) {
//         console.log(err);
//         return;
//     }

//     console.log("Database Connected");
// });

// module.exports = db;