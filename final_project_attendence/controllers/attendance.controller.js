const Student = require("../models/Student");
const Attendance = require("../models/Attendance");
const sequelize = require("../config/db");

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
const markAttendance = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { date, attendance } = req.body;

    if (!date || !attendance || !Array.isArray(attendance)) {
      await transaction.rollback();

      return res.status(400).json({
        message: "Date and attendance are required"
      });
    }

    for (const record of attendance) {
      await Attendance.create(
        {
          studentId: record.studentId,
          date: date,
          status: record.status
        },
        { transaction }
      );
    }

    await transaction.commit();

    res.status(201).json({
      message: "Attendance marked successfully"
    });

  } catch (error) {
    await transaction.rollback();

    console.error(error);

    res.status(500).json({
      message: "Failed to mark attendance"
    });
  }
};
const getAttendanceReport = async (req, res) => {
  try {
    const students = await Student.findAll({
      order: [["rollNumber", "ASC"]]
    });

    const attendance = await Attendance.findAll();

    const report = students.map((student) => {
      const studentAttendance = attendance.filter(
        (record) => record.studentId === student.id
      );

      const total = studentAttendance.length;

      const present = studentAttendance.filter(
        (record) => record.status === "Present"
      ).length;

      const percentage =
        total === 0
          ? 0
          : Number(((present / total) * 100).toFixed(2));

      return {
        id: student.id,
        name: student.name,
        rollNumber: student.rollNumber,
        section: student.section,
        present,
        total,
        percentage
      };
    });

    res.status(200).json(report);

  } catch (error) {
    console.error("REPORT ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch attendance report"
    });
  }
};

module.exports = {
  getStudentsForAttendance,
  markAttendance,
};