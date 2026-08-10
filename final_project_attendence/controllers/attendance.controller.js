const Student = require("../models/Student");

const getStudentsForAttendance = async (req, res) => {
  try {
    const students = await Student.findAll({
      order: [["rollNumber", "ASC"]]
    });

    res.status(200).json(students);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch students"
    });
  }
};

module.exports = {
  getStudentsForAttendance
};