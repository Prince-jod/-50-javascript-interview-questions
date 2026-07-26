const express = require("express");

const router = express.Router();

// GET /students
router.get("/", (req, res) => {
    res.send("List of all students");
});

// GET /students/:id
router.get("/:id", (req, res) => {
    const id = req.params.id;
    res.send(`Student ID: ${id}`);
});

module.exports = router;