const express=require('express');

const router=express.Router();

router.get('/orders',(req,res)=>{
  res.send("order fetched");
})
router.post('/orders',(req,res)=>{
  res.send("order created");
})
module.exports=router;