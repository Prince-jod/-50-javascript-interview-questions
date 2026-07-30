const express =require('express');
const app=express();
const mysql=require('mysql2');
const port=4000;
const connection=mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'Prince007@',
  database:'testdb'
})
app.get('/',(req,res)=>{
  res.send("shame on youhh mf!!")
})
app.listen(port,(err)=>{
  console.log("server is running on ",port);
});