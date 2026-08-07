const express =require('express');

const router=express.Router();

const verifyToken = require('../middlewares/auth.middleware');
const {createStudent,getAllStudents,getStudentById,updateStudent,deleteStudent}=require('../controllers/student.controller')

router.use(verifyToken);

router.post('/',createStudent);
router.get('/',getAllStudents);
router.get('/:id',getStudentById);
router.put('/:id',updateStudent);
router.delete('/:id',deleteStudent);

module.exports=router;
