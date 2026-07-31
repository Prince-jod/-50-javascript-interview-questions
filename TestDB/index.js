const express = require("express");
const db=require('../utils/db-connection');
const app = express();

const studentRoutes = require("./Routers/StudentRoutes");

app.use(express.json());

app.use("/students", studentRoutes);


app.listen(4000, () => {

    console.log("Server Running On Port 4000");

});