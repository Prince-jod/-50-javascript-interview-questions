const express=require('express');

const app=express();

const port=3000;
const User = require("./models/User");

app.use(express.json());

sequelize.sync()
.then(()=>{console.log("table is created")})
.catch(err=>console.log(err));

app.use('/users,userRoutes')

app.listen(port,()=>{
  console.log(`server is running on port 3000`);
})