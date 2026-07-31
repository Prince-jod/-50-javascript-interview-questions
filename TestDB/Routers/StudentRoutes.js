const express =require ('express');
const studentController=require('../Controllers/StudentController');
const router=express.Router();

router.post('/add',studentController.addEntries);

module.exports=router;