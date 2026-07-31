const express = require("express");
const db = require("./utils/db-connection");
const app = express();
const studentModel=require('./Models/StudentModels');
const studentRoutes = require("./Routers/StudentRoutes");

app.use(express.json());

app.use("/students", studentRoutes);

db.sync({ force: true })
.then(() => {

    app.listen(4000, () => {
        console.log("Server Running On Port 4000");
    });

})
.catch((err) => {
    console.log(err);
});