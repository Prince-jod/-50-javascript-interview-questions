const express = require("express");

const app = express();
const PORT = 4000;

const studentRouter = require("./routes/students");
const courseRouter = require("./routes/courses");

// Home Route
app.get("/", (req, res) => {
    res.send("Welcome to the Student & Course API");
});

// Routes
app.use("/students", studentRouter);
app.use("/courses", courseRouter);

// 404 Handler
app.use((req, res) => {
    res.status(404).send("Page not found");
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});