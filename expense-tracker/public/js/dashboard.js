const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user") || "null");

// Guard: bounce back to login if there's no session.
if (!token || !user) {
    window.location.href = "/login";
}

document.getElementById("userName").textContent = user ? user.name : "";

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
        localStorage.removeItem("user");
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


// ---------- Expenses ----------

const expenseForm = document.getElementById("expenseForm");
const expenseFormTitle = document.getElementById("expenseFormTitle");
const expenseSubmitBtn = document.getElementById("expenseSubmitBtn");
const expenseCancelBtn = document.getElementById("expenseCancelBtn");
const expensesTableBody = document.querySelector("#expensesTable tbody");
const expensesEmpty = document.getElementById("expensesEmpty");
const totalAmountEl = document.getElementById("totalAmount");

let expensesCache = [];


async function loadExpenses() {
    const response = await apiFetch("/api/expenses");

    if (!response) return;

    const data = await response.json();

    expensesCache = response.ok ? (data.expenses || []) : [];

    renderExpensesTable();
    renderTotal();
}


function renderExpensesTable() {
    expensesTableBody.innerHTML = "";

    if (expensesCache.length === 0) {
        expensesEmpty.style.display = "block";
        return;
    }

    expensesEmpty.style.display = "none";

    expensesCache.forEach((expense) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${escapeHtml(expense.date)}</td>
            <td>${escapeHtml(expense.title)}</td>
            <td>${escapeHtml(expense.category)}</td>
            <td>₹${Number(expense.amount).toFixed(2)}</td>

            <td class="actions-cell">
                <button class="edit-btn" data-id="${expense.id}">
                    Edit
                </button>

                <button class="delete-btn" data-id="${expense.id}">
                    Delete
                </button>
            </td>
        `;

        expensesTableBody.appendChild(row);
    });


    expensesTableBody
        .querySelectorAll(".edit-btn")
        .forEach((btn) => {
            btn.addEventListener("click", () => {
                startEditExpense(btn.dataset.id);
            });
        });


    expensesTableBody
        .querySelectorAll(".delete-btn")
        .forEach((btn) => {
            btn.addEventListener("click", () => {
                deleteExpense(btn.dataset.id);
            });
        });
}


function renderTotal() {
    const total = expensesCache.reduce(
        (sum, e) => sum + Number(e.amount),
        0
    );

    totalAmountEl.textContent = `₹${total.toFixed(2)}`;
}


function startEditExpense(id) {
    const expense = expensesCache.find(
        (e) => String(e.id) === String(id)
    );

    if (!expense) return;

    document.getElementById("e-id").value = expense.id;
    document.getElementById("e-title").value = expense.title;
    document.getElementById("e-amount").value = expense.amount;
    document.getElementById("e-category").value = expense.category;
    document.getElementById("e-date").value = expense.date;

    expenseFormTitle.textContent = "Edit Expense";
    expenseSubmitBtn.textContent = "Update Expense";

    expenseCancelBtn.style.display = "inline-block";

    expenseForm.scrollIntoView({
        behavior: "smooth",
        block: "center",
    });
}


function resetExpenseForm() {
    expenseForm.reset();

    document.getElementById("e-id").value = "";

    expenseFormTitle.textContent = "Add Expense";
    expenseSubmitBtn.textContent = "Add Expense";

    expenseCancelBtn.style.display = "none";
}


expenseCancelBtn.addEventListener(
    "click",
    resetExpenseForm
);


expenseForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("e-id").value;

    const payload = {
        title: document.getElementById("e-title").value.trim(),
        amount: document.getElementById("e-amount").value,
        category: document.getElementById("e-category").value,
        date: document.getElementById("e-date").value,
    };

    const url = id
        ? `/api/expenses/${id}`
        : "/api/expenses";

    const method = id
        ? "PUT"
        : "POST";


    const response = await apiFetch(url, {
        method,
        body: JSON.stringify(payload),
    });

    if (!response) return;

    const data = await response.json();

    if (response.ok) {
        resetExpenseForm();
        await loadExpenses();
    } else {
        alert(data.message);
    }
});


async function deleteExpense(id) {
    if (!confirm("Delete this expense?")) return;

    const response = await apiFetch(
        `/api/expenses/${id}`,
        {
            method: "DELETE",
        }
    );

    if (!response) return;

    const data = await response.json();

    if (response.ok) {
        await loadExpenses();
    } else {
        alert(data.message);
    }
}


// ---------- Cashfree Premium Payment ----------

const premiumBtn = document.getElementById("premiumBtn");


premiumBtn.addEventListener("click", async () => {

    try {

        premiumBtn.disabled = true;
        premiumBtn.textContent = "Processing...";


        // 1. Ask backend to create our PENDING order
        const response = await apiFetch(
            "/api/payment/create-order",
            {
                method: "POST",
            }
        );


        if (!response) return;


        const data = await response.json();


        // Backend returned an error
        if (!response.ok) {

            alert(
                data.message ||
                "Unable to create payment order"
            );

            return;
        }


        console.log(
            "Payment Session ID:",
            data.paymentSessionId
        );


        // 2. Initialize Cashfree
        const cashfree = Cashfree({
            mode: "sandbox",
        });


        // 3. Open Cashfree Checkout
        await cashfree.checkout({
            paymentSessionId: data.paymentSessionId,
            redirectTarget: "_modal",
        });

        // Verify payment after checkout
const verifyResponse = await apiFetch(
    "/api/payment/verify",
    {
        method: "POST",
        body: JSON.stringify({
            orderId: data.orderId,
        }),
    }
);

if (!verifyResponse) return;
s
const verifyData = await verifyResponse.json();

if (verifyResponse.ok) {
    if (verifyData.status === "SUCCESSFUL") {
        alert("Transaction successful");
    } else if (verifyData.status === "FAILED") {
        alert("TRANSACTION FAILED.");
    }
} else {
    alert(
        verifyData.message ||
        "Unable to verify payment"
    );
}


    } catch (error) {

        console.error(
            "Payment error:",
            error
        );

        alert(
            "Something went wrong while starting payment."
        );

    } finally {

        premiumBtn.disabled = false;
        premiumBtn.textContent =
            "Buy Premium Membership";

    }

});


// ---------- Logout ----------

document
    .getElementById("logoutBtn")
    .addEventListener("click", () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "/login";

    });


// ---------- Init ----------

loadExpenses();