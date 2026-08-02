const express = require("express");
const cors = require("cors");
const path = require("path");

const sequelize = require("./config/db");
require("./models/User");
const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/users", userRoutes);

// Database Connection & Table Creation
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database connected and table created successfully.");

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error connecting to database:", err);
  });