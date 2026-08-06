const express =require('express');

const router=express.Router();

const {createStudent}=require('../controllers/student.controller')

router.post('/',createStudent);

module.exports=router;