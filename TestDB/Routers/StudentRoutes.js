const express =require ('express');
const studentController=require('./Controllers/StudentController');
const router=express.Router();

router.post('/',studentController);

module.exports=router;