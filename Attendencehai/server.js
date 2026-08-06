const express = require("express");
const cors = require("cors");
const path = require("path");
const studentRoutes=require('../routes/student.routes');
require("dotenv").config();

const sequelize = require("./config/db");
require("./models/Association");
const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);

sequelize
  .sync()
  .then(() => {
    console.log("Database connected and models synced.");
  })
  .catch((err) => {
    console.log("Database Error:", err);
  });

const port = 3000;

app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "signup.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});