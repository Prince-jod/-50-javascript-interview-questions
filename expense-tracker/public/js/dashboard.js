const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user") || "null");

const premiumMessage = document.getElementById("premiumMessage");
const leaderboardBtn = document.getElementById("leaderboardBtn");

leaderboardBtn.addEventListener("click", async () => {

    const response = await apiFetch("/api/leaderboard");

    if (!response) return;

    const data = await response.json();

    console.log(data);
});

// Guard: bounce back to login if there's no session
if (!token || !user) {
    window.location.href = "/login";
}

document.getElementById("userName").textContent = user ? user.name : "";

const authHeaders = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
};


// =====================================================
// API FETCH WRAPPER
// =====================================================

async function apiFetch(url, options = {}) {

    const response = await fetch(url, {
        ...options,

        headers: {
            ...authHeaders,
            ...(options.headers || {}),
        },
    });

    // If JWT is invalid/expired
    if (response.status === 401) {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "/login";

        return null;
    }

    return response;
}


// =====================================================
// PREMIUM STATUS
// =====================================================

function checkPremiumStatus() {

    if (user && user.isPrime === true) {

        premiumMessage.style.display = "block";
        leaderboardBtn.style.display = "inline-block";

    } else {

        premiumMessage.style.display = "none";
        leaderboardBtn.style.display = "none";

    }
}
leaderboardBtn.addEventListener("click", async () => {

    const response = await apiFetch("/api/leaderboard");

    if (!response) return;

    const data = await response.json();

    console.log(data);
});


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHtml(str) {

    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// =====================================================
// EXPENSE ELEMENTS
// =====================================================

const expenseForm =
    document.getElementById("expenseForm");

const expenseFormTitle =
    document.getElementById("expenseFormTitle");

const expenseSubmitBtn =
    document.getElementById("expenseSubmitBtn");

const expenseCancelBtn =
    document.getElementById("expenseCancelBtn");

const expensesTableBody =
    document.querySelector("#expensesTable tbody");

const expensesEmpty =
    document.getElementById("expensesEmpty");

const totalAmountEl =
    document.getElementById("totalAmount");

let expensesCache = [];


// =====================================================
// LOAD EXPENSES
// =====================================================

async function loadExpenses() {

    const response =
        await apiFetch("/api/expenses");

    if (!response) return;

    const data =
        await response.json();

    expensesCache =
        response.ok
            ? (data.expenses || [])
            : [];

    renderExpensesTable();

    renderTotal();
}


// =====================================================
// RENDER EXPENSE TABLE
// =====================================================

function renderExpensesTable() {

    expensesTableBody.innerHTML = "";

    if (expensesCache.length === 0) {

        expensesEmpty.style.display = "block";

        return;
    }

    expensesEmpty.style.display = "none";


    expensesCache.forEach((expense) => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${escapeHtml(expense.name)}
            </td>

            <td>
                ${escapeHtml(expense.date)}
            </td>

            <td>
                ${escapeHtml(expense.title)}
            </td>

            <td>
                ${escapeHtml(expense.category)}
            </td>

            <td>
                ₹${Number(expense.amount).toFixed(2)}
            </td>

            <td class="actions-cell">

                <button
                    class="edit-btn"
                    data-id="${expense.id}"
                >
                    Edit
                </button>

                <button
                    class="delete-btn"
                    data-id="${expense.id}"
                >
                    Delete
                </button>

            </td>
        `;


        expensesTableBody.appendChild(row);
    });


    // Edit buttons

    expensesTableBody
        .querySelectorAll(".edit-btn")
        .forEach((btn) => {

            btn.addEventListener(
                "click",
                () => {
                    startEditExpense(
                        btn.dataset.id
                    );
                }
            );

        });


    // Delete buttons

    expensesTableBody
        .querySelectorAll(".delete-btn")
        .forEach((btn) => {

            btn.addEventListener(
                "click",
                () => {
                    deleteExpense(
                        btn.dataset.id
                    );
                }
            );

        });
}


// =====================================================
// TOTAL EXPENSE
// =====================================================

function renderTotal() {

    const total =
        expensesCache.reduce(
            (sum, expense) =>
                sum + Number(expense.amount),
            0
        );


    totalAmountEl.textContent =
        `₹${total.toFixed(2)}`;
}


// =====================================================
// START EDIT EXPENSE
// =====================================================

function startEditExpense(id) {

    const expense =
        expensesCache.find(
            (e) =>
                String(e.id) === String(id)
        );


    if (!expense) return;


    document.getElementById("e-id").value =
        expense.id;

    document.getElementById("e-name").value =
        expense.name;

    document.getElementById("e-title").value =
        expense.title;

    document.getElementById("e-amount").value =
        expense.amount;

    document.getElementById("e-category").value =
        expense.category;

    document.getElementById("e-date").value =
        expense.date;


    expenseFormTitle.textContent =
        "Edit Expense";

    expenseSubmitBtn.textContent =
        "Update Expense";

    expenseCancelBtn.style.display =
        "inline-block";


    expenseForm.scrollIntoView({
        behavior: "smooth",
        block: "center",
    });
}


// =====================================================
// RESET EXPENSE FORM
// =====================================================

function resetExpenseForm() {

    expenseForm.reset();

    document.getElementById("e-id").value = "";

    expenseFormTitle.textContent =
        "Add Expense";

    expenseSubmitBtn.textContent =
        "Add Expense";

    expenseCancelBtn.style.display =
        "none";
}


// =====================================================
// CANCEL EDIT
// =====================================================

expenseCancelBtn.addEventListener(
    "click",
    resetExpenseForm
);


// =====================================================
// ADD / UPDATE EXPENSE
// =====================================================

expenseForm.addEventListener(
    "submit",
    async (e) => {

        e.preventDefault();


        const id =
            document.getElementById("e-id").value;


        const payload = {

            name:
                document
                    .getElementById("e-name")
                    .value
                    .trim(),

            title:
                document
                    .getElementById("e-title")
                    .value
                    .trim(),

            amount:
                document
                    .getElementById("e-amount")
                    .value,

            category:
                document
                    .getElementById("e-category")
                    .value,

            date:
                document
                    .getElementById("e-date")
                    .value,
        };


        const url = id
            ? `/api/expenses/${id}`
            : "/api/expenses";


        const method = id
            ? "PUT"
            : "POST";


        const response =
            await apiFetch(
                url,
                {
                    method,
                    body: JSON.stringify(payload),
                }
            );


        if (!response) return;


        const data =
            await response.json();


        if (response.ok) {

            resetExpenseForm();

            await loadExpenses();

        } else {

            alert(
                data.message ||
                "Unable to save expense"
            );
        }

    }
);


// =====================================================
// DELETE EXPENSE
// =====================================================

async function deleteExpense(id) {

    if (
        !confirm(
            "Delete this expense?"
        )
    ) {
        return;
    }


    const response =
        await apiFetch(
            `/api/expenses/${id}`,
            {
                method: "DELETE",
            }
        );


    if (!response) return;


    const data =
        await response.json();


    if (response.ok) {

        await loadExpenses();

    } else {

        alert(
            data.message ||
            "Unable to delete expense"
        );
    }
}


// =====================================================
// CASHFREE PREMIUM PAYMENT
// =====================================================

const premiumBtn =
    document.getElementById("premiumBtn");


premiumBtn.addEventListener(
    "click",
    async () => {

        try {

            premiumBtn.disabled = true;

            premiumBtn.textContent =
                "Processing...";


            // -----------------------------------------
            // 1. Create PENDING order
            // -----------------------------------------

            const response =
                await apiFetch(
                    "/api/payment/create-order",
                    {
                        method: "POST",
                    }
                );


            if (!response) return;


            const data =
                await response.json();


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


            // -----------------------------------------
            // 2. Initialize Cashfree
            // -----------------------------------------

            const cashfree =
                Cashfree({
                    mode: "sandbox",
                });


            // -----------------------------------------
            // 3. Open Cashfree Checkout
            // -----------------------------------------

            await cashfree.checkout({

                paymentSessionId:
                    data.paymentSessionId,

                redirectTarget:
                    "_modal",

            });


            // -----------------------------------------
            // 4. Verify payment
            // -----------------------------------------

            const verifyResponse =
                await apiFetch(
                    "/api/payment/verify",
                    {
                        method: "POST",

                        body: JSON.stringify({
                            orderId:
                                data.orderId,
                        }),
                    }
                );


            if (!verifyResponse) return;


            const verifyData =
                await verifyResponse.json();


            // -----------------------------------------
            // 5. Payment successful
            // -----------------------------------------

            if (verifyResponse.ok) {

                if (
                    verifyData.status ===
                    "SUCCESSFUL"
                ) {

                    alert(
                        "Transaction successful"
                    );


                    // Mark current user as premium
                    user.isPrime = true;


                    // Save updated user
                    localStorage.setItem(
                        "user",
                        JSON.stringify(user)
                    );


                    // Show premium message
                    checkPremiumStatus();


                } else if (
                    verifyData.status ===
                    "FAILED"
                ) {

                    alert(
                        "TRANSACTION FAILED."
                    );

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

    }
);


// =====================================================
// LOGOUT
// =====================================================

document
    .getElementById("logoutBtn")
    .addEventListener(
        "click",
        () => {

            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "user"
            );

            window.location.href =
                "/login";

        }
    );


// =====================================================
// INITIALIZE DASHBOARD
// =====================================================

loadExpenses();

checkPremiumStatus();