const Student=require('../models/Student');


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
    return res.status(201).json({
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


const getStudentById=async (req,res)=>{
  try{
  const {id}=req.params;
  const student =await Student.findByPk(id);

  if(!student){
    return res.status(404).json({
      message:"student does not exists"
    })
    
  }
  return res.status(200).json({
      messgage:"student  exsits ",
      Name:student.name,
      student,
    })
}
catch(err){
  return res.status(500).json({
    message:"internal server error",
    err
  })
}
}


const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if student exists
    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(404).json({
        message: "Student does not exist",
      });
    }

    const { name, rollNumber, section, email, phone } = req.body;

    // Check if another student already has this roll number
    if (rollNumber) {
      const existingStudent = await Student.findOne({
        where: {
          rollNumber,
        },
      });

      if (existingStudent && existingStudent.id !== student.id) {
        return res.status(409).json({
          message: "Roll number already exists",
        });
      }
    }

    // Update student
    await student.update({
      name,
      rollNumber,
      section,
      email,
      phone,
    });

    return res.status(200).json({
      message: "Student updated successfully",
      student,
    });

  } catch (error) {
    console.error("Update Student Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};





const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(404).json({
        message: "Student does not exist",
      });
    }

    await student.destroy();

    return res.status(200).json({
      message: "Student deleted successfully",
    });
  } catch (error) {
    console.error("Delete Student Error:", error);

    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.status(409).json({
        message:
          "Cannot delete this student — they have attendance records linked to them.",
      });
    }

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};


module.exports={
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,

}