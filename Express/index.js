const express = require("express");

const app = express();
const port = 4000;

// Middleware
app.use((req, res, next) => {
    req.user = "Guest";
    next();
});

// Welcome Route
app.get("/welcome", (req, res) => {
    res.send(`<h1>Welcome, ${req.user}!</h1>`);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});