const express = require("express");
const sequelize = require("./utils/db");

const userRoutes = require("./routes/userRoutes");
const busRoutes = require("./routes/busRoutes");

// Import models so Sequelize creates the tables
require("./models/userModel");
require("./models/busModel");
require("./models/bookingModel");
require("./models/paymentModel");

const app = express();

app.use(express.json());

sequelize.sync()
.then(() => console.log("Tables Created"))
.catch(err => console.log(err));

app.use("/users", userRoutes);
app.use("/buses", busRoutes);

app.listen(3000, () => {
    console.log("Server running on port 3000");
});