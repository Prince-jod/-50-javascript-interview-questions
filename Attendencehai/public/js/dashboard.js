const token = localStorage.getItem("token");
let teacher = JSON.parse(localStorage.getItem("teacher") || "null");

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

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ---------- Students ----------

const studentForm = document.getElementById("studentForm");
const studentFormTitle = document.getElementById("studentFormTitle");
const studentSubmitBtn = document.getElementById("studentSubmitBtn");
const studentCancelBtn = document.getElementById("studentCancelBtn");
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
      <td class="actions-cell">
        <button class="edit-btn" data-id="${student.id}">Edit</button>
        <button class="delete-btn" data-id="${student.id}">Delete</button>
      </td>
    `;
    studentsTableBody.appendChild(row);
  });

  studentsTableBody.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", () => startEditStudent(btn.dataset.id));
  });
  studentsTableBody.querySelectorAll(".delete-btn").forEach((btn) => {
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

function startEditStudent(id) {
  const student = studentsCache.find((s) => String(s.id) === String(id));
  if (!student) return;

  document.getElementById("s-id").value = student.id;
  document.getElementById("s-name").value = student.name;
  document.getElementById("s-roll").value = student.rollNumber;
  document.getElementById("s-section").value = student.section;
  document.getElementById("s-email").value = student.email || "";
  document.getElementById("s-phone").value = student.phone || "";

  studentFormTitle.textContent = "Edit Student";
  studentSubmitBtn.textContent = "Update Student";
  studentCancelBtn.style.display = "inline-block";

  studentForm.scrollIntoView({ behavior: "smooth", block: "center" });
}

function resetStudentForm() {
  studentForm.reset();
  document.getElementById("s-id").value = "";
  studentFormTitle.textContent = "Add Student";
  studentSubmitBtn.textContent = "Add Student";
  studentCancelBtn.style.display = "none";
}

studentCancelBtn.addEventListener("click", resetStudentForm);

studentForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("s-id").value;
  const payload = {
    name: document.getElementById("s-name").value.trim(),
    rollNumber: document.getElementById("s-roll").value.trim(),
    section: document.getElementById("s-section").value.trim(),
    email: document.getElementById("s-email").value.trim() || null,
    phone: document.getElementById("s-phone").value.trim() || null,
  };

  const url = id ? `/api/students/${id}` : "/api/students";
  const method = id ? "PUT" : "POST";

  const response = await apiFetch(url, {
    method,
    body: JSON.stringify(payload),
  });
  if (!response) return;

  const data = await response.json();

  if (response.ok) {
    resetStudentForm();
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

const STATUS_OPTIONS = ["Present", "Absent", "Leave"];

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
      const statusOptions = STATUS_OPTIONS.map(
        (s) =>
          `<option value="${s}" ${s === record.status ? "selected" : ""}>${s}</option>`
      ).join("");

      row.innerHTML = `
        <td>${escapeHtml(record.date)}</td>
        <td>${escapeHtml(record.Student ? record.Student.name : "-")}</td>
        <td>${escapeHtml(record.Student ? record.Student.rollNumber : "-")}</td>
        <td><select class="status-select" data-id="${record.id}">${statusOptions}</select></td>
        <td>${escapeHtml(record.Teacher ? record.Teacher.name : "-")}</td>
        <td class="actions-cell">
          <button class="save-btn" data-id="${record.id}">Save</button>
          <button class="delete-btn" data-id="${record.id}">Delete</button>
        </td>
      `;
      attendanceTableBody.appendChild(row);
    });

  attendanceTableBody.querySelectorAll(".save-btn").forEach((btn) => {
    btn.addEventListener("click", () => updateAttendance(btn.dataset.id));
  });
  attendanceTableBody.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", () => deleteAttendance(btn.dataset.id));
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

async function updateAttendance(id) {
  const select = attendanceTableBody.querySelector(`.status-select[data-id="${id}"]`);
  const status = select.value;

  const response = await apiFetch(`/api/attendence/${id}`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
  if (!response) return;

  const data = await response.json();

  if (response.ok) {
    await loadAttendance();
  } else {
    alert(data.message);
  }
}

async function deleteAttendance(id) {
  if (!confirm("Delete this attendance record?")) return;

  const response = await apiFetch(`/api/attendence/${id}`, {
    method: "DELETE",
  });
  if (!response) return;

  const data = await response.json();

  if (response.ok) {
    await loadAttendance();
  } else {
    alert(data.message);
  }
}

// ---------- Teachers ----------

const teacherForm = document.getElementById("teacherForm");
const teacherCancelBtn = document.getElementById("teacherCancelBtn");
const teachersTableBody = document.querySelector("#teachersTable tbody");
const teachersEmpty = document.getElementById("teachersEmpty");

let teachersCache = [];

async function loadTeachers() {
  const response = await apiFetch("/api/teachers");
  if (!response) return;

  const data = await response.json();
  teachersCache = response.ok ? (data.teachers || []) : [];

  renderTeachersTable();
}

function renderTeachersTable() {
  teachersTableBody.innerHTML = "";

  if (teachersCache.length === 0) {
    teachersEmpty.style.display = "block";
    return;
  }
  teachersEmpty.style.display = "none";

  teachersCache.forEach((t) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${escapeHtml(t.name)}${String(t.id) === String(teacher.id) ? " (you)" : ""}</td>
      <td>${escapeHtml(t.email)}</td>
      <td class="actions-cell">
        <button class="edit-btn" data-id="${t.id}">Edit</button>
        <button class="delete-btn" data-id="${t.id}">Delete</button>
      </td>
    `;
    teachersTableBody.appendChild(row);
  });

  teachersTableBody.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", () => startEditTeacher(btn.dataset.id));
  });
  teachersTableBody.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", () => deleteTeacher(btn.dataset.id));
  });
}

function startEditTeacher(id) {
  const t = teachersCache.find((x) => String(x.id) === String(id));
  if (!t) return;

  document.getElementById("t-id").value = t.id;
  document.getElementById("t-name").value = t.name;
  document.getElementById("t-email").value = t.email;
  document.getElementById("t-password").value = "";

  teacherForm.style.display = "flex";
  teacherForm.scrollIntoView({ behavior: "smooth", block: "center" });
}

function resetTeacherForm() {
  teacherForm.reset();
  teacherForm.style.display = "none";
}

teacherCancelBtn.addEventListener("click", resetTeacherForm);

teacherForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("t-id").value;
  const password = document.getElementById("t-password").value;

  const payload = {
    name: document.getElementById("t-name").value.trim(),
    email: document.getElementById("t-email").value.trim(),
  };
  if (password) payload.password = password;

  const response = await apiFetch(`/api/teachers/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  if (!response) return;

  const data = await response.json();

  if (response.ok) {
    // If the logged-in teacher edited their own name, reflect it immediately.
    if (String(id) === String(teacher.id)) {
      teacher = { ...teacher, name: data.teacher.name, email: data.teacher.email };
      localStorage.setItem("teacher", JSON.stringify(teacher));
      document.getElementById("teacherName").textContent = teacher.name;
    }
    resetTeacherForm();
    await loadTeachers();
  } else {
    alert(data.message);
  }
});

async function deleteTeacher(id) {
  const deletingSelf = String(id) === String(teacher.id);
  const confirmMsg = deletingSelf
    ? "This is your own account. Deleting it will log you out. Continue?"
    : "Delete this teacher?";

  if (!confirm(confirmMsg)) return;

  const response = await apiFetch(`/api/teachers/${id}`, {
    method: "DELETE",
  });
  if (!response) return;

  const data = await response.json();

  if (response.ok) {
    if (deletingSelf) {
      localStorage.removeItem("token");
      localStorage.removeItem("teacher");
      window.location.href = "/login";
      return;
    }
    await loadTeachers();
  } else {
    alert(data.message);
  }
}

// ---------- Logout ----------

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("teacher");
  window.location.href = "/login";
});

// ---------- Init ----------

loadStudents();
loadAttendance();
loadTeachers();
