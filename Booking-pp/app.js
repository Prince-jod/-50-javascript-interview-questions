const express = require("express");
const cors = require("cors");

const sequelize = require("./config/db");
const User = require("./models/User"); // Registers the model
const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/users", userRoutes);

// Database Connection & Table Creation
sequelize
  .sync()
  .then(() => {
    console.log("Database connected and table created successfully.");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error connecting to database:", err);
  });