const express = require("express");

const router = express.Router();
const courses = [

{ id: 1, name: "Frontend", description: "HTML, CSS, JS, React" },

{ id: 2, name: "Backend", description: "Node.js, Express, MongoDB" }

];
// GET /courses
router.get("/", (req, res) => {
    res.json(courses);
});

// GET /courses/:id
router.get("/:id", (req, res) => {
    const id=parseInt(req.params.id);
    const course=courses.find((x)=x.id===id);
    if(!course){
      return ({
        message:"course not found",
      })
    }
    res.json(course);
});

module.exports = router;