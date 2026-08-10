const Student = require("./Student");
const Attendance = require("./Attendance");

Student.hasMany(Attendance, {
  foreignKey: "studentId",
  onDelete: "CASCADE",
});

Attendance.belongsTo(Student, {
  foreignKey: "studentId",
});