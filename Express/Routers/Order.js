const express=require('express');

const router=express.Router();

router.get('/',(req,res)=>{
  res.send("order fetched");
})
router.post('/',(req,res)=>{
  res.send("order created");
})
module.exports=router;