const express =require ('express');
const studentController=require('../Controllers/StudentController');
const router=express.Router();

router.post('/add',studentController.addEntries);
router.post('/update/:id',studentController.updateEntry);

module.exports=router;