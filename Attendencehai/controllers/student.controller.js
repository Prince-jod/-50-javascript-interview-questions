const students=require('../modles/Student');


const createStudent=async (req,res)=>{
  try{
    const { name, rollNumber, section, email, phone } = req.body;

 if (!name || !rollNumber || !section) {
      return res.status(400).json({
        message: "Name, Roll Number and Section are required",
      });
    }
    const existingStudent = await Student.findOne({
      where: {
        rollNumber,
      },
    });
    if (existingStudent) {
      return res.status(409).json({
        message: "Student with this roll number already exists",
      });
    }

    const newStudent= await Student.create({
      name,
      rollNumber,
      section,
      email,
      phone,
    });
    return res.status(200).json({
      message:"student is created successfully ",
      student:newStudent
    });
  }
  catch(err){
    return res.status(500).json({
      message:"internal server error"
    })
  }
}



const getAllStudents= async (req,res)=>{
  try{
   const students=await Student.findAll()

   return res.status(200).json({
    message:"fetched the student successfully",
    students,
   })
  }
  catch(error){
    console.error("Get student error",error);
    return res.status(500).json({
      message:"internal server error"
    })
  }
}