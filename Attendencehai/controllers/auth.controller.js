const Teacher = require("../models/Teacher");
const bcrypt = require("bcrypt");

const register = async (req, res) => {
  try {
    // Get data from request body
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Check if email already exists
    const teacher = await Teacher.findOne({
      where: {
        email,
      },
    });

    if (teacher) {
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create teacher
    const newTeacher = await Teacher.create({
      name,
      email,
      password: hashedPassword,
    });

    // Success response
    return res.status(201).json({
      message: "Teacher registered successfully",
      teacher: {
        id: newTeacher.id,
        name: newTeacher.name,
        email: newTeacher.email,
      },
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  register,
};