const searchBtn = document.getElementById("searchBtn");
const markAttendanceBtn = document.getElementById("markAttendanceBtn");

const attendanceDate = document.getElementById("attendanceDate");
const studentList = document.getElementById("studentList");
const message = document.getElementById("message");


let students = [];


// SEARCH
searchBtn.addEventListener("click", async () => {

  const date = attendanceDate.value;

  if (!date) {
    message.textContent = "Please select a date";
    return;
  }

  try {

    const response = await fetch(
      `/api/attendance?date=${date}`
    );

    const data = await response.json();

    if (!response.ok) {
      message.textContent = data.message;
      return;
    }

    students = data;

    displayStudents(data);

    message.textContent = "";

  } catch (error) {

    console.error(error);

    message.textContent = "Something went wrong";
  }
});


// DISPLAY STUDENTS
function displayStudents(students) {

  studentList.innerHTML = "";

  students.forEach((student) => {

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${student.rollNumber}</td>

      <td>${student.name}</td>

      <td>
        <input
          type="radio"
          name="student-${student.id}"
          value="Present"
          ${student.status === "Present" ? "checked" : ""}
        >
      </td>

      <td>
        <input
          type="radio"
          name="student-${student.id}"
          value="Absent"
          ${student.status === "Absent" ? "checked" : ""}
        >
      </td>
    `;

    studentList.appendChild(row);
  });
}


// MARK ATTENDANCE
markAttendanceBtn.addEventListener("click", async () => {

  const date = attendanceDate.value;

  if (!date) {
    message.textContent = "Please select a date";
    return;
  }

  const attendance = [];

  for (const student of students) {

    const selected = document.querySelector(
      `input[name="student-${student.id}"]:checked`
    );

    if (!selected) {
      message.textContent =
        `Please mark attendance for ${student.name}`;

      return;
    }

    attendance.push({
      studentId: student.id,
      status: selected.value
    });
  }

  try {

    const response = await fetch("/api/attendance", {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        date,
        attendance
      })

    });

    const data = await response.json();

    if (!response.ok) {
      message.textContent = data.message;
      return;
    }

    message.textContent =
      "Attendance marked successfully";

  } catch (error) {

    console.error(error);

    message.textContent =
      "Something went wrong";
  }

});