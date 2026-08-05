const Teacher=require('../models/Teacher');

const bcryptt=require('bcrypt');

const register=(req,res)=>{
  const {email,name,password}=req.body;

 if (!name || !email || !password) {
    return res.status(400).json({
        message: "All fields are required",
    });
  }

};