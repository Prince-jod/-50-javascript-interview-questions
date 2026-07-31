const db = require("../utils/db-connection");

// Insert
const addStudent = (req, res) => {

    const { name, email, age } = req.body;

    const query = `
    INSERT INTO students(name,email,age)
    VALUES(?,?,?)
    `;

    db.execute(query, [name, email, age], (err, result) => {

        if (err)
            return res.status(500).json({ error: err.message });

        console.log("Inserted:", result.insertId);

        res.status(201).json({
            message: "Student Added",
            id: result.insertId
        });

    });

};

// Get All

const getStudents = (req, res) => {

    db.execute("SELECT * FROM students", (err, result) => {

        if (err)
            return res.status(500).json({ error: err.message });

        res.json(result);

    });

};

// Get By Id

const getStudentById = (req, res) => {

    const { id } = req.params;

    db.execute(
        "SELECT * FROM students WHERE id=?",
        [id],
        (err, result) => {

            if (err)
                return res.status(500).json({ error: err.message });

            if (result.length === 0)
                return res.status(404).send("Student Not Found");

            res.json(result[0]);

        });

};

// Update

const updateStudent = (req, res) => {

    const { id } = req.params;

    const { name, email, age } = req.body;

    const query = `
    UPDATE students
    SET name=?, email=?, age=?
    WHERE id=?
    `;

    db.execute(query, [name, email, age, id], (err, result) => {

        if (err)
            return res.status(500).json({ error: err.message });

        if (result.affectedRows === 0)
            return res.status(404).send("Student Not Found");

        console.log("Updated:", id);

        res.send("Student Updated");

    });

};

// Delete

const deleteStudent = (req, res) => {

    const { id } = req.params;

    db.execute(
        "DELETE FROM students WHERE id=?",
        [id],
        (err, result) => {

            if (err)
                return res.status(500).json({ error: err.message });

            if (result.affectedRows === 0)
                return res.status(404).send("Student Not Found");

            console.log("Deleted:", id);

            res.send("Student Deleted");

        });

};

module.exports = {
    addStudent,
    getStudents,
    getStudentById,
    updateStudent,
    deleteStudent
};