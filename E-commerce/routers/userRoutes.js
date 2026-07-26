const express = require("express");

const router = express.Router();

// GET /users
router.get("/", (req, res) => {
    res.send("Fetching all users");
});

// POST /users
router.post("/", (req, res) => {
    res.send("Adding a new user");
});

// GET /users/:id
router.get("/:id", (req, res) => {
    res.send(`Fetching user with ID: ${req.params.id}`);
});

module.exports = router;