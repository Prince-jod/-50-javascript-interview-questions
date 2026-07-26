const express=require('express');
const router=express.Router();

router.get('/',(req,res)=>{
  res.setHeader('Content-type','text/html');
  res.send(`
  <h1>    Here is the list of books! </h1>
    `)
});
router.post('/',(req,res)=>{
  res.send("Book has been added!");
})
module.exports=router;