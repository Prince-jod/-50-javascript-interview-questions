import { useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import css from "../css/dashboard.css?inline";
import useStyle from "../useStyle";
import { apiFetch, getSession, clearSession, saveUser } from "../api";

const CATEGORIES = ["Food", "Travel", "Shopping", "Bills", "Health", "Entertainment", "Other"];

const PAGE_SIZES = [5, 10, 20, 50];

// Builds [1, "...", 4, 5, 6, "...", 20] style page lists
function getPageList(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  const out = [];
  sorted.forEach((n, i) => {
    if (i > 0 && n - sorted[i - 1] > 1) out.push("...");
    out.push(n);
  });
  return out;
}

const emptyForm = {
  id: "",
  name: "",
  title: "",
  amount: "",
  category: "Food",
  date: "",
};

// Guard: bounce back to login if there's no session
export default function Dashboard() {
  const session = getSession();
  if (!session) return <Navigate to="/login" replace />;
  return <DashboardInner initialUser={session.user} />;
}

function DashboardInner({ initialUser }) {
  useStyle(css);

  const [user, setUser] = useState(initialUser);
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [leaderboard, setLeaderboard] = useState(null); // null = section hidden
  const [paying, setPaying] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(() => {
    const saved = Number(localStorage.getItem("expensesPageSize"));
    return PAGE_SIZES.includes(saved) ? saved : 5;
  });
  const formRef = useRef(null);

  const isPrime = user?.isPrime === true;
  const isEditing = Boolean(form.id);
  const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  // ---------------- PAGINATION (client side) ----------------
  const totalPages = Math.max(1, Math.ceil(expenses.length / pageSize));
  const currentPage = Math.min(page, totalPages); // stays valid after deletes
  const startIndex = (currentPage - 1) * pageSize;
  const pagedExpenses = expenses.slice(startIndex, startIndex + pageSize);

  function changePageSize(e) {
    const size = Number(e.target.value);
    setPageSize(size);
    setPage(1);
    localStorage.setItem("expensesPageSize", String(size));
  }

  // ---------------- LOAD EXPENSES ----------------
  async function loadExpenses() {
    const response = await apiFetch("/api/expenses");
    if (!response) return;
    const data = await response.json();
    setExpenses(response.ok ? data.expenses || [] : []);
  }

  useEffect(() => {
    loadExpenses();
  }, []);

  // ---------------- FORM HELPERS ----------------
  function updateField(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function resetExpenseForm() {
    setForm(emptyForm);
  }

  function startEditExpense(id) {
    const expense = expenses.find((e) => String(e.id) === String(id));
    if (!expense) return;
    setForm({
      id: expense.id,
      name: expense.name,
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      date: expense.date,
    });
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  // ---------------- ADD / UPDATE EXPENSE ----------------
  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      name: form.name.trim(),
      title: form.title.trim(),
      amount: form.amount,
      category: form.category,
      date: form.date,
    };

    const url = form.id ? `/api/expenses/${form.id}` : "/api/expenses";
    const method = form.id ? "PUT" : "POST";

    const response = await apiFetch(url, { method, body: JSON.stringify(payload) });
    if (!response) return;
    const data = await response.json();

    if (response.ok) {
      resetExpenseForm();
      await loadExpenses();
    } else {
      alert(data.message || "Unable to save expense");
    }
  }

  // ---------------- DELETE EXPENSE ----------------
  async function deleteExpense(id) {
    if (!confirm("Delete this expense?")) return;

    const response = await apiFetch(`/api/expenses/${id}`, { method: "DELETE" });
    if (!response) return;
    const data = await response.json();

    if (response.ok) {
      await loadExpenses();
    } else {
      alert(data.message || "Unable to delete expense");
    }
  }

  // ---------------- LEADERBOARD ----------------
  async function handleLeaderboard() {
    try {
      const response = await apiFetch("/api/leaderboard");
      if (!response) return;
      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to fetch leaderboard");
        return;
      }
      setLeaderboard(data.leaderboard);
    } catch (error) {
      console.error("Leaderboard Error:", error);
      alert("Something went wrong while loading leaderboard");
    }
  }

  // ---------------- DOWNLOAD PDF (PREMIUM) ----------------
  function handleDownload() {
    if (!isPrime) {
      alert("Please buy Premium Membership to download your expenses.");
      return;
    }
    if (expenses.length === 0) {
      alert("No expenses available to download.");
      return;
    }

    try {
      const doc = new jsPDF();

      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text("EXPENSE REPORT", 105, 20, { align: "center" });

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`User: ${user.name || "User"}`, 14, 32);
      doc.text(`Generated On: ${new Date().toLocaleDateString("en-IN")}`, 14, 39);
      doc.text(`Total Records: ${expenses.length}`, 14, 46);

      const totalAmount = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);

      const tableRows = expenses.map((e) => [
        String(e.name ?? ""),
        String(e.date ?? ""),
        String(e.title ?? ""),
        String(e.category ?? ""),
        `Rs. ${Number(e.amount || 0).toFixed(2)}`,
      ]);

      autoTable(doc, {
        startY: 55,
        head: [["Name", "Date", "Title", "Category", "Amount"]],
        body: tableRows,
        theme: "grid",
        styles: { fontSize: 9, cellPadding: 3, overflow: "linebreak" },
        headStyles: { fillColor: [41, 98, 255], textColor: 255, fontStyle: "bold" },
        columnStyles: {
          0: { cellWidth: 32 },
          1: { cellWidth: 27 },
          2: { cellWidth: 45 },
          3: { cellWidth: 35 },
          4: { cellWidth: 37, halign: "right" },
        },
        margin: { left: 14, right: 14, bottom: 20 },
        didDrawPage: function () {
          const pageHeight = doc.internal.pageSize.height;
          const pageNumber = doc.internal.getCurrentPageInfo().pageNumber;
          doc.setFontSize(9);
          doc.setFont("helvetica", "normal");
          doc.text("Expense Report", 14, pageHeight - 10);
          doc.text(`Page ${pageNumber}`, 196, pageHeight - 10, { align: "right" });
        },
      });

      let finalY = doc.lastAutoTable.finalY + 12;
      if (finalY > doc.internal.pageSize.height - 20) {
        doc.addPage();
        finalY = 20;
      }
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(`TOTAL EXPENSES: Rs. ${totalAmount.toFixed(2)}`, 14, finalY);

      doc.save("Expense_Report.pdf");
    } catch (error) {
      console.error("PDF Download Error:", error);
      alert("Unable to generate PDF. Please try again.");
    }
  }

  // ---------------- CASHFREE PREMIUM PAYMENT ----------------
  async function handlePremium() {
    try {
      setPaying(true);

      // 1. Create PENDING order
      const response = await apiFetch("/api/payment/create-order", { method: "POST" });
      if (!response) return;
      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to create payment order");
        return;
      }

      // 2. Initialize Cashfree
      const cashfree = window.Cashfree({ mode: "sandbox" });

      // 3. Open Cashfree Checkout
      await cashfree.checkout({
        paymentSessionId: data.paymentSessionId,
        redirectTarget: "_modal",
      });

      // 4. Verify payment
      const verifyResponse = await apiFetch("/api/payment/verify", {
        method: "POST",
        body: JSON.stringify({ orderId: data.orderId }),
      });
      if (!verifyResponse) return;
      const verifyData = await verifyResponse.json();

      // 5. Result
      if (verifyResponse.ok) {
        if (verifyData.status === "SUCCESSFUL") {
          alert("Transaction successful");
          const updated = { ...user, isPrime: true };
          saveUser(updated);
          setUser(updated);
        } else if (verifyData.status === "FAILED") {
          alert("TRANSACTION FAILED.");
        }
      } else {
        alert(verifyData.message || "Unable to verify payment");
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Something went wrong while starting payment.");
    } finally {
      setPaying(false);
    }
  }

  // ---------------- LOGOUT ----------------
  function handleLogout() {
    clearSession();
    window.location.href = "/login";
  }

  return (
    <>
      {/* Topbar */}
      <header className="topbar">
        <h1>Expense Tracker</h1>

        <div className="topbar-right">
          <span id="userName">{user ? user.name : ""}</span>

          {/* Buy Premium Button */}
          <button
            id="premiumBtn"
            className="btn-premium"
            onClick={handlePremium}
            disabled={paying}
          >
            {paying ? "Processing..." : "Buy Premium Membership"}
          </button>

          {/* Leaderboard (premium only) */}
          {isPrime && (
            <button
              id="leaderboardBtn"
              className="btn-outline"
              style={{ display: "inline-block" }}
              onClick={handleLeaderboard}
            >
              🏆 Leaderboard
            </button>
          )}

          <button id="downloadExpensesBtn" type="button" onClick={handleDownload}>
            Download Expenses
          </button>

          {/* Logout */}
          <button id="logoutBtn" className="btn-outline" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <main>
        {/* Premium User Message */}
        {isPrime && (
          <div
            id="premiumMessage"
            className="premium-message"
            style={{ display: "block" }}
          >
            🎉 You are a premium user now
          </div>
        )}

        {/* Total Spent */}
        <section className="card summary-card">
          <div>
            <p className="summary-label">Total Spent</p>
            <p className="summary-value" id="totalAmount">
              ₹{total.toFixed(2)}
            </p>
          </div>
        </section>

        {/* Add / Edit Expense */}
        <section className="card">
          <h2 id="expenseFormTitle">{isEditing ? "Edit Expense" : "Add Expense"}</h2>

          <form id="expenseForm" className="inline-form" ref={formRef} onSubmit={handleSubmit}>
            <input
              type="text"
              id="e-name"
              placeholder="Name"
              value={form.name}
              onChange={updateField("name")}
              required
            />

            <input
              type="text"
              id="e-title"
              placeholder="Title"
              value={form.title}
              onChange={updateField("title")}
              required
            />

            <input
              type="number"
              id="e-amount"
              placeholder="Amount"
              min="0"
              step="0.01"
              value={form.amount}
              onChange={updateField("amount")}
              required
            />

            <select
              id="e-category"
              value={form.category}
              onChange={updateField("category")}
              required
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <input
              type="date"
              id="e-date"
              value={form.date}
              onChange={updateField("date")}
              required
            />

            <button type="submit" id="expenseSubmitBtn">
              {isEditing ? "Update Expense" : "Add Expense"}
            </button>

            {isEditing && (
              <button
                type="button"
                id="expenseCancelBtn"
                className="btn-outline"
                style={{ display: "inline-block" }}
                onClick={resetExpenseForm}
              >
                Cancel
              </button>
            )}
          </form>
        </section>

        {/* Expenses */}
        <section className="card">
          <h2>Expenses</h2>

          <div className="table-wrap">
            <table id="expensesTable">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Date</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedExpenses.map((expense) => (
                  <tr key={expense.id}>
                    <td>{expense.name}</td>
                    <td>{expense.date}</td>
                    <td>{expense.title}</td>
                    <td>{expense.category}</td>
                    <td>₹{Number(expense.amount).toFixed(2)}</td>
                    <td className="actions-cell">
                      <button className="edit-btn" onClick={() => startEditExpense(expense.id)}>
                        Edit
                      </button>
                      <button className="delete-btn" onClick={() => deleteExpense(expense.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {expenses.length === 0 && (
              <p id="expensesEmpty" className="empty-msg" style={{ display: "block" }}>
                No expenses added yet.
              </p>
            )}
          </div>

          {/* Pagination */}
          {expenses.length > 0 && (
            <div className="pagination" id="expensesPagination">
              <label className="page-size">
                Rows per page:
                <select value={pageSize} onChange={changePageSize}>
                  {PAGE_SIZES.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>

              <span className="page-info">
                {startIndex + 1}-{Math.min(startIndex + pageSize, expenses.length)} of{" "}
                {expenses.length}
              </span>

              <div className="page-buttons">
                <button
                  type="button"
                  onClick={() => setPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Prev
                </button>

                {getPageList(currentPage, totalPages).map((n, i) =>
                  n === "..." ? (
                    <span key={`dots-${i}`} className="page-dots">
                      ...
                    </span>
                  ) : (
                    <button
                      type="button"
                      key={n}
                      className={n === currentPage ? "active" : ""}
                      onClick={() => setPage(n)}
                    >
                      {n}
                    </button>
                  )
                )}

                <button
                  type="button"
                  onClick={() => setPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Leaderboard */}
        {leaderboard && (
          <section id="leaderboardSection" className="card" style={{ display: "block" }}>
            <h2>🏆 Leaderboard</h2>

            <div className="table-wrap">
              <table id="leaderboardTable">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>User</th>
                    <th>Total Expense</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.name}</td>
                      <td>₹{Number(item.totalExpense).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
