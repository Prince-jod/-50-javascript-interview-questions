const express = require("express");

const router = express.Router();
const ProductController=require('../controllers/ProductController');
// GET /courses
router.get("/", );

// GET /courses/:id
router.get("/:id", (req, res) => {
    const id=parseInt(req.params.id);
    const course=courses.find((x)=>x.id===id);
    if(!course){
      return ({
        message:"course not found",
      })
    }
    res.json(course);
});

module.exports = router;