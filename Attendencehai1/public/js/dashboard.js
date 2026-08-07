const token = localStorage.getItem("token");
const teacher = JSON.parse(localStorage.getItem("teacher") || "null");

// Guard: bounce back to login if there's no session.
if (!token || !teacher) {
  window.location.href = "/login";
}

document.getElementById("teacherName").textContent = teacher ? teacher.name : "";

const authHeaders = {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${token}`,
};

// Central fetch wrapper: if the token is invalid/expired, boot back to login.
async function apiFetch(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...authHeaders,
      ...(options.headers || {}),
    },
  });

  if (response.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("teacher");
    window.location.href = "/login";
    return null;
  }

  return response;
}

// ---------- Students ----------

const studentForm = document.getElementById("studentForm");
const studentsTableBody = document.querySelector("#studentsTable tbody");
const studentsEmpty = document.getElementById("studentsEmpty");
const attendanceStudentSelect = document.getElementById("a-student");

let studentsCache = [];

async function loadStudents() {
  const response = await apiFetch("/api/students");
  if (!response) return;

  const data = await response.json();

  studentsCache = response.ok ? (data.students || []) : [];

  renderStudentsTable();
  renderStudentOptions();
}

function renderStudentsTable() {
  studentsTableBody.innerHTML = "";

  if (studentsCache.length === 0) {
    studentsEmpty.style.display = "block";
    return;
  }
  studentsEmpty.style.display = "none";

  studentsCache.forEach((student) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${escapeHtml(student.name)}</td>
      <td>${escapeHtml(student.rollNumber)}</td>
      <td>${escapeHtml(student.section)}</td>
      <td>${escapeHtml(student.email || "-")}</td>
      <td>${escapeHtml(student.phone || "-")}</td>
      <td><button class="delete-btn" data-id="${student.id}">Delete</button></td>
    `;
    studentsTableBody.appendChild(row);
  });

  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", () => deleteStudent(btn.dataset.id));
  });
}

function renderStudentOptions() {
  const currentValue = attendanceStudentSelect.value;
  attendanceStudentSelect.innerHTML =
    '<option value="" disabled selected>Select Student</option>';

  studentsCache.forEach((student) => {
    const option = document.createElement("option");
    option.value = student.id;
    option.textContent = `${student.name} (${student.rollNumber})`;
    attendanceStudentSelect.appendChild(option);
  });

  if (currentValue) attendanceStudentSelect.value = currentValue;
}

studentForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    name: document.getElementById("s-name").value.trim(),
    rollNumber: document.getElementById("s-roll").value.trim(),
    section: document.getElementById("s-section").value.trim(),
    email: document.getElementById("s-email").value.trim() || null,
    phone: document.getElementById("s-phone").value.trim() || null,
  };

  const response = await apiFetch("/api/students", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!response) return;

  const data = await response.json();

  if (response.ok) {
    studentForm.reset();
    await loadStudents();
  } else {
    alert(data.message);
  }
});

async function deleteStudent(id) {
  if (!confirm("Delete this student?")) return;

  const response = await apiFetch(`/api/students/${id}`, {
    method: "DELETE",
  });
  if (!response) return;

  const data = await response.json();

  if (response.ok) {
    await loadStudents();
  } else {
    alert(data.message);
  }
}

// ---------- Attendance ----------

const attendanceForm = document.getElementById("attendanceForm");
const attendanceTableBody = document.querySelector("#attendanceTable tbody");
const attendanceEmpty = document.getElementById("attendanceEmpty");

async function loadAttendance() {
  const response = await apiFetch("/api/attendence");
  if (!response) return;

  const data = await response.json();
  const records = response.ok ? (data.attendence || []) : [];

  attendanceTableBody.innerHTML = "";

  if (records.length === 0) {
    attendanceEmpty.style.display = "block";
    return;
  }
  attendanceEmpty.style.display = "none";

  records
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .forEach((record) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${escapeHtml(record.date)}</td>
        <td>${escapeHtml(record.Student ? record.Student.name : "-")}</td>
        <td>${escapeHtml(record.Student ? record.Student.rollNumber : "-")}</td>
        <td class="status-${record.status}">${escapeHtml(record.status)}</td>
        <td>${escapeHtml(record.Teacher ? record.Teacher.name : "-")}</td>
      `;
      attendanceTableBody.appendChild(row);
    });
}

attendanceForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const studentId = document.getElementById("a-student").value;
  const status = document.getElementById("a-status").value;

  if (!studentId) {
    alert("Please select a student.");
    return;
  }

  const response = await apiFetch("/api/attendence", {
    method: "POST",
    body: JSON.stringify({ studentId, status }),
  });
  if (!response) return;

  const data = await response.json();

  if (response.ok) {
    await loadAttendance();
  } else {
    alert(data.message);
  }
});

// ---------- Logout ----------

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("teacher");
  window.location.href = "/login";
});

// ---------- Helpers ----------

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ---------- Init ----------

loadStudents();
loadAttendance();
