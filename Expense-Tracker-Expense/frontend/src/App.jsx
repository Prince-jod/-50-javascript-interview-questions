import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:3000/api/expenses";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const expensesPerPage = 10;

  // Fetch expenses from the backend
  useEffect(() => {
    async function fetchExpenses() {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please log in to view your expenses.");
          return;
        }

        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch expenses.");
        }

        setExpenses(data.expenses || []);
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }

    fetchExpenses();
  }, []);

  const totalPages = Math.max(
    1,
    Math.ceil(expenses.length / expensesPerPage)
  );

  const startIndex = (currentPage - 1) * expensesPerPage;

  const currentExpenses = expenses.slice(
    startIndex,
    startIndex + expensesPerPage
  );

  const totalAmount = expenses.reduce(
    (total, expense) => total + Number(expense.amount),
    0
  );

  // Delete an expense from the backend
  async function deleteExpense(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this expense?"
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please log in again.");
        return;
      }

      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete expense.");
      }

      const updatedExpenses = expenses.filter(
        (expense) => expense.id !== id
      );

      setExpenses(updatedExpenses);

      const updatedTotalPages = Math.max(
        1,
        Math.ceil(updatedExpenses.length / expensesPerPage)
      );

      if (currentPage > updatedTotalPages) {
        setCurrentPage(updatedTotalPages);
      }

      setError("");
    } catch (err) {
      setError(err.message || "Could not delete expense.");
    }
  }

  // Download expenses as a CSV file
  function downloadExpenses() {
    const headers = ["Name", "Date", "Title", "Category", "Amount"];

    const rows = expenses.map((expense) => [
      expense.name,
      expense.date,
      expense.title,
      expense.category,
      expense.amount,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map(
            (value) =>
              `"${String(value ?? "").replace(/"/g, '""')}"`
          )
          .join(",")
      )
      .join("\r\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "my-expenses.csv";
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <div className="dashboard">
      <header className="header">
        <div>
          <h1>Expense Tracker</h1>
          <p>Manage your expenses in one place.</p>
        </div>

        <button className="premium-button" type="button">
          Buy Premium
        </button>
      </header>

      <section className="summary">
        <div className="summary-card">
          <p>Total Expenses</p>
          <h2>{expenses.length}</h2>
        </div>

        <div className="summary-card">
          <p>Total Amount</p>
          <h2>₹{totalAmount.toFixed(2)}</h2>
        </div>
      </section>

      <section className="expenses-section">
        <div className="section-header">
          <div>
            <h2>Your Expenses</h2>
            <p>View and manage your transactions.</p>
          </div>

          <button
            className="download-button"
            type="button"
            onClick={downloadExpenses}
          >
            Download Expenses
          </button>
        </div>

        {error && <p className="error-message">{error}</p>}

        {loading ? (
          <p>Loading expenses...</p>
        ) : (
          <>
            <div className="table-container">
              <table>
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
                  {currentExpenses.map((expense) => (
                    <tr key={expense.id}>
                      <td>{expense.name}</td>
                      <td>{expense.date}</td>
                      <td>{expense.title}</td>
                      <td>
                        <span className="category">
                          {expense.category}
                        </span>
                      </td>
                      <td>₹{Number(expense.amount).toFixed(2)}</td>
                      <td>
                        <button
                          className="delete-button"
                          type="button"
                          onClick={() => deleteExpense(expense.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {expenses.length === 0 && (
                <p className="empty-message">No expenses found.</p>
              )}
            </div>

            <div className="pagination">
              <span className="pagination-count">
                Showing{" "}
                {expenses.length === 0 ? 0 : startIndex + 1}
                {"–"}
                {Math.min(
                  startIndex + expensesPerPage,
                  expenses.length
                )}{" "}
                of {expenses.length} expenses
              </span>

              <div className="pagination-controls">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((page) => page - 1)
                  }
                >
                  Previous
                </button>

                <span>
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((page) => page + 1)
                  }
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default App;
