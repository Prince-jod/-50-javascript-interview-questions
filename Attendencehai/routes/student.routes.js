const express =require('express');

const router=express.Router();

const {createStudent,getAllStudents,getStudentById}=require('../controllers/student.controller')

router.post('/',createStudent);
router.get('/',getAllStudents);
router.get('/:id',getStudentById);

module.exports=router;