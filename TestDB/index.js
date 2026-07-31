const express = require("express");
const db=require('../utils/db-connection');
const app = express();

const studentRoutes = require("./Routers/StudentRoutes");

app.use(express.json());

app.use("/students", studentRoutes);

db.sync().then((res)=>{
app.listen(4000, () => {

    console.log("Server Running On Port 4000");

});
}).catch((err)=>{
    console.log(err);
})
