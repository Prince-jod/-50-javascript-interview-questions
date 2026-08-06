const Attendence = require("../models/Attendence");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");

const markAttendence = async (req, res) => {
  console.log("piinnagidgadg");
  try {
    const { studentId, teacherId, status } = req.body;

    // Check required fields
    if (!studentId || !teacherId || !status) {
      return res.status(400).json({
        message: "Student ID, Teacher ID and Status are required",
      });
    }

    // Check if student exists
    const student = await Student.findByPk(studentId);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    // Check if teacher exists
    const teacher = await Teacher.findByPk(teacherId);

    if (!teacher) {
      return res.status(404).json({
        message: "Teacher not found",
      });
    }

    // Today's date
    const today = new Date().toISOString().split("T")[0];

    // Check if attendance is already marked
    const existingAttendence = await Attendence.findOne({
      where: {
        studentId,
        date: today,
      },
    });

    if (existingAttendence) {
      return res.status(409).json({
        message: "Attendance already marked for today",
      });
    }

    // Create attendance
    const attendence = await Attendence.create({
      studentId,
      teacherId,
      date: today,
      status,
    });

    return res.status(201).json({
      message: "Attendance marked successfully",
      attendence,
    });

  } catch (error) {
    console.error("Mark Attendence Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  markAttendence,
};