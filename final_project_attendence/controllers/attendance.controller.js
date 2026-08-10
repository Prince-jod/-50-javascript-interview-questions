const Student = require("../models/Student");
const Attendance = require("../models/Attendance");

const getStudentsForAttendance = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        message: "Date is required"
      });
    }

    const students = await Student.findAll({
      order: [["rollNumber", "ASC"]]
    });

    const attendance = await Attendance.findAll({
      where: {
        date: date
      }
    });

    const attendanceMap = {};

    attendance.forEach((record) => {
      attendanceMap[record.studentId] = record.status;
    });

    const result = students.map((student) => ({
      id: student.id,
      name: student.name,
      rollNumber: student.rollNumber,
      section: student.section,
      status: attendanceMap[student.id] || null
    }));

    res.status(200).json(result);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch attendance"
    });
  }
};

module.exports = {
  getStudentsForAttendance
};