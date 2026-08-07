const Teacher = require("../models/Teacher");
const bcrypt = require("bcrypt");

const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.findAll({
      attributes: { exclude: ["password"] },
    });

    return res.status(200).json({
      message: "Teachers fetched successfully",
      teachers,
    });
  } catch (error) {
    console.error("Get Teachers Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const getTeacherById = async (req, res) => {
  try {
    const { id } = req.params;

    const teacher = await Teacher.findByPk(id, {
      attributes: { exclude: ["password"] },
    });

    if (!teacher) {
      return res.status(404).json({
        message: "Teacher does not exist",
      });
    }

    return res.status(200).json({
      message: "Teacher exists",
      teacher,
    });
  } catch (error) {
    console.error("Get Teacher Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;

    const teacher = await Teacher.findByPk(id);

    if (!teacher) {
      return res.status(404).json({
        message: "Teacher does not exist",
      });
    }

    const { name, email, password } = req.body;

    // If the email is changing, make sure it isn't already taken.
    if (email) {
      const existingTeacher = await Teacher.findOne({ where: { email } });

      if (existingTeacher && existingTeacher.id !== teacher.id) {
        return res.status(409).json({
          message: "Email already in use",
        });
      }
    }

    const updates = { name, email };

    // Password is optional on update — only hash and set it if provided.
    if (password) {
      updates.password = await bcrypt.hash(password, 10);
    }

    await teacher.update(updates);

    return res.status(200).json({
      message: "Teacher updated successfully",
      teacher: {
        id: teacher.id,
        name: teacher.name,
        email: teacher.email,
      },
    });
  } catch (error) {
    console.error("Update Teacher Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;

    const teacher = await Teacher.findByPk(id);

    if (!teacher) {
      return res.status(404).json({
        message: "Teacher does not exist",
      });
    }

    await teacher.destroy();

    return res.status(200).json({
      message: "Teacher deleted successfully",
    });
  } catch (error) {
    console.error("Delete Teacher Error:", error);

    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.status(409).json({
        message:
          "Cannot delete this teacher — they have attendance records linked to them.",
      });
    }

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  getAllTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
};
