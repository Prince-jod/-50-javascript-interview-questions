const express =require('express');
const cors=require('cors');
require('dotenv').config();

const sequelize=require('./config/db');

const app=express();
const path=require('path');
app.use(cors());
app.use(express.json());


app.use(express.static(path.join(__dirname, "public")));
sequelize.authenticate()
.then(()=>console.log("database connected  successfully"))
.catch((err)=>console.log("got an error",err));

const port=3000;

app.listen(port,()=>{
  console.log("server is running");
})

