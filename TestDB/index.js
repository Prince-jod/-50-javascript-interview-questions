const express =require('express');
const app=express();
const mysql=require('mysql2');
const port=4000;
const connection=mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'Prince007@',
  database:'testdb'
});
connection.connect((err)=>{
  if(err){
    console.log(err);
    return ;
  }
  
  console.log(`database is connected`);


  //making query for database
  const createtable=`create table Employees(
  id int auto_increment primary key,
  name varchar(12) not null,
  dept_id int default 34
  )`
  connection.execute(createtable,(err)=>{
    if(err){
      console.log("query has an error",err);
      return ;
    }
    console.log("table is created");
  });
  
})
app.get('/',(req,res)=>{
  res.send("shame on youhh mf!!")
})
app.listen(port,(err)=>{
  console.log("server is running on ",port);
});
// const express=require('express');
// const app=express();
// const port=4000;
// const mysql=require('mysql2');
// const connection=mysql.createConnection({
//   host:'localhost',
//   user:'root',
//   password:'Prince007@',
//   database:'testdb'
// });
// connection.connect((err)=>{
//   if(err){
//     console.log(err);
//     return
//   }
//   console.log("connection is made with datbase");

//   const createquery=`create table newone(
  
//   )`
//   connection.exexute(createquery,(err)=>{
//     if(err){
//       console.log("");
//       return;
//     }
//     console.log("table is created");

//   })
// })


// app.get('/',(req,res)=>{
//   res.send("hello mf wriiteen by myself");
// })

// app.listen(port,()=>{
// console.log(`server is running`);
// });