require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const sequelize = require("./config/db");
require("./models/User");
require("./models/Expense"); // sets up the association with User

const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Serve the plain HTML signup/login/dashboard pages
app.use(express.static(path.join(__dirname, "public")));
app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "signup.html"));
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});
// API routes
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);

const PORT = process.env.PORT || 5000;

// Sync Sequelize models with MySQL, then start the server
sequelize
  .authenticate()
  .then(() => {
    console.log("MySQL connection established.");
    return sequelize.sync(); // creates tables if they don't exist yet
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
      console.log(`Signup page: http://localhost:${PORT}/signup.html`);
      console.log(`Login page:  http://localhost:${PORT}/login.html`);
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
