const Student = require("../models/Student");

const students = [
  {
    name: "Prince",
    rollNumber: "101",
    section: "A"
  },
  {
    name: "Rahul",
    rollNumber: "102",
    section: "A"
  },
  {
    name: "Aman",
    rollNumber: "103",
    section: "A"
  },
  {
    name: "Rohit",
    rollNumber: "104",
    section: "A"
  },
  {
    name: "Ankit",
    rollNumber: "105",
    section: "A"
  },
  {
    name: "Karan",
    rollNumber: "106",
    section: "A"
  },
  {
    name: "Mohit",
    rollNumber: "107",
    section: "A"
  },
  {
    name: "Vishal",
    rollNumber: "108",
    section: "A"
  },
  {
    name: "Arjun",
    rollNumber: "109",
    section: "A"
  },
  {
    name: "Aditya",
    rollNumber: "110",
    section: "A"
  },
  {
    name: "Neeraj",
    rollNumber: "111",
    section: "A"
  },
  {
    name: "Harsh",
    rollNumber: "112",
    section: "A"
  },
  {
    name: "Saurabh",
    rollNumber: "113",
    section: "A"
  },
  {
    name: "Yash",
    rollNumber: "114",
    section: "A"
  },
  {
    name: "Ayush",
    rollNumber: "115",
    section: "A"
  }
];

const seedStudents = async () => {
  await Student.bulkCreate(students, {
    ignoreDuplicates: true
  });

  console.log("15 students inserted");
};

module.exports = seedStudents;