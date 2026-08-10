const express =require('express');
const cors=require('cors');
const Student=require('./models/student');
const seedStudents = require("./seed/student.seed");
const port =4000;

const sequelize=require('./config/db');

require('./models/Association');

const app =express();
app.use(cors());
app.use(express.urlencoded({extended:true}));

app.use(express.static('public'));
app.use(express.json());
app.get('/',(req,res)=>{
  res.sendFile(__dirname + "/view/index.html");
});

sequelize.authenticate()
.then(()=>{
  console.log("My sql connected");
  return sequelize.sync();
})
.then(()=>{
  console.log("Model synced");
  await seedStudents();
  app.listen(port,()=>{
  console.log("server is running on port--",port);
})

})
.catch((err)=>{
  console.error("database connection failed error",err);
})

