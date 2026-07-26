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
    const id = parseInt(req.params.id);
    const student=students.find((stu)=>stu.id===id);
    if(!student){
        return res.status(404).json({
            message:"student not found",
        })
    }
    res.json(student);
});

module.exports = router;