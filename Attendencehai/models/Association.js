const Teacher=require('./Teacher');
const Student=require('./Student');

const Attendence=require('./Attendence');
 // teacher <-----> Attendence
Teacher.hasMany(Attendence,{
  foreignKey:"teacherId"
});

Attendence.belongsTo(Teacher,{
  foreignKey:"teacherId"
});
// students<------>Attendence
Student.hasMany(Attendence, {
  foreignKey: "studentId",
});

Attendence.belongsTo(Student, {
  foreignKey: "studentId",
});

module.exports = {
  Teacher,
  Student,
  Attendence,
};
