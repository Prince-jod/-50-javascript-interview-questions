const express = require("express");

const router = express.Router();

const students = [

{ id: 1, name: "Alice" },

{ id: 2, name: "Bob" },

{ id: 3, name: "Charlie" }

];
// GET /students
router.get("/", (req, res) => {
    res.json(students);
});

// GET /students/:id
router.get("/:id", (req, res) => {
    const id = req.params.id;
    res.send(`Student ID: ${id}`);
});

module.exports = router;