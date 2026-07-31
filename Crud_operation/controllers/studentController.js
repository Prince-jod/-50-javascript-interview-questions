const Student = require("../models/studentModel");

// Insert
exports.createStudent = async (req, res) => {
    try {
        const student = await Student.create(req.body);
        res.status(201).json(student);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Read All
exports.getAllStudents = async (req, res) => {
    try {
        const students = await Student.findAll();
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Read By PK
exports.getStudentById = async (req, res) => {
    try {
        const student = await Student.findByPk(req.params.id);

        if (!student) {
            return res.status(404).json({ message: "Student Not Found" });
        }

        res.json(student);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update
exports.updateStudent = async (req, res) => {
    try {
        const student = await Student.findByPk(req.params.id);

        if (!student) {
            return res.status(404).json({ message: "Student Not Found" });
        }

        await student.update(req.body);

        res.json(student);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete
exports.deleteStudent = async (req, res) => {
    try {
        const student = await Student.findByPk(req.params.id);

        if (!student) {
            return res.status(404).json({ message: "Student Not Found" });
        }

        await student.destroy();

        res.json({ message: "Student Deleted Successfully" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};