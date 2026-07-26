const express = require("express");

const router = express.Router();

// GET /courses
router.get("/", (req, res) => {
    res.send("List of all courses");
});

// GET /courses/:id
router.get("/:id", (req, res) => {
    const id = req.params.id;
    res.send(`Course ID: ${id}`);
});

module.exports = router;