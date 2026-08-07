const Attendence = require("../models/Attendence");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");

const markAttendence = async (req, res) => {
  try {
    const { studentId, status } = req.body;
    // Teacher comes from the verified JWT, not the request body,
    // so a teacher can only mark attendance as themselves.
    const teacherId = req.teacher.id;

    // Check required fields
    if (!studentId || !status) {
      return res.status(400).json({
        message: "Student ID and Status are required",
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

const getAllAttendence = async (req, res) => {
  try {
    const attendence = await Attendence.findAll({
      include: [
        {
          model: Student,
          attributes: ["id", "name", "rollNumber", "section"],
        },
        {
          model: Teacher,
          attributes: ["id", "name", "email"],
        },
      ],
    });

    if (attendence.length === 0) {
      return res.status(404).json({
        message: "No attendance records found",
      });
    }

    return res.status(200).json({
      message: "Attendance fetched successfully",
      attendence,
    });
  } catch (error) {
    console.error("Get Attendence Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const updateAttendence = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        message: "Status is required",
      });
    }

    const attendence = await Attendence.findByPk(id);

    if (!attendence) {
      return res.status(404).json({
        message: "Attendance record not found",
      });
    }

    await attendence.update({ status });

    return res.status(200).json({
      message: "Attendance updated successfully",
      attendence,
    });
  } catch (error) {
    console.error("Update Attendence Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const deleteAttendence = async (req, res) => {
  try {
    const { id } = req.params;

    const attendence = await Attendence.findByPk(id);

    if (!attendence) {
      return res.status(404).json({
        message: "Attendance record not found",
      });
    }

    await attendence.destroy();

    return res.status(200).json({
      message: "Attendance deleted successfully",
    });
  } catch (error) {
    console.error("Delete Attendence Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  markAttendence,
  getAllAttendence,
  updateAttendence,
  deleteAttendence,
};