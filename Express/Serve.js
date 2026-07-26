const express = require("express");

const app = express();
const PORT = 3000;

// Logging Middleware
app.use((req, res, next) => {
    console.log(`${req.method} request made to ${req.url}`);
    next();
});

// GET /products
app.get("/products/:name", (req, res) => {
  const params=req.params.name;
  const name=req.query.name;
  const age=req.query.age;
    res.send(`welcome ${params} and your name is ${name} and your age is ${age}`);
});

// POST /products
app.post("/products", (req, res) => {
    res.send("A new product has been added.");
});

// GET /categories
app.get("/categories", (req, res) => {
    res.send("Here is the list of all categories.");
});

// POST /categories
app.post("/categories", (req, res) => {
    res.send("A new category has been created.");
});

// Wildcard route (must be the last route)


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});