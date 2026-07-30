const express =require('express');
const app=express();
const mysql=require('mysql2');
const port=4000;
app.get('/',(req,res)=>{
  res.send("shame on youhh mf!!")
})
app.listen(port,(err)=>{
  console.log("server is running on ",port);
});