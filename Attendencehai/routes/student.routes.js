const express =require('express');

const router=express.Router();

const {createStudent,getAllStudents,getStudentById,updateStudent}=require('../controllers/student.controller')

router.post('/',createStudent);
router.get('/',getAllStudents);
router.get('/:id',getStudentById);
router.put('/:id',updateStudent)

module.exports=router;