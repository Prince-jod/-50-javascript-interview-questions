const express=require('express');
const router=express.Router();

router.get('/books',(req,res)=>{
  req.setHeader('Content-type','text/html');
  res.send(`
  <h1>    Here is the list of books! </h1>
    `)
});
router.post('/books',(req,res)=>{
  res.send("Book has been added!");
})
module.exports=router;