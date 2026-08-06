const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const sequelize = require("./config/db");
require('../models');
const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/auth", authRoutes);

sequelize
  .sync()
  .then(() => {
    console.log("Database connected and models synced.");
  })
  .catch((err) => {
    console.log("Database Error:", err);
  });

const port = 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});