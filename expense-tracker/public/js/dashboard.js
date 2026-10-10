const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user") || "null");

const premiumMessage =
    document.getElementById("premiumMessage");

// Guard: bounce back to login if there's no session
if (!token || !user) {
    window.location.href = "/login";
}

document.getElementById("userName").textContent =
    user ? user.name : "";

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

    const leaderboardBtn =
        document.getElementById("leaderboardBtn");


    if (!premiumMessage) return;


    if (user && user.isPrime === true) {

        // Show premium message
        premiumMessage.style.display = "block";


        // Show leaderboard button
        if (leaderboardBtn) {
            leaderboardBtn.style.display = "inline-block";
        }

    } else {

        // Hide premium message
        premiumMessage.style.display = "none";


        // Hide leaderboard button
        if (leaderboardBtn) {
            leaderboardBtn.style.display = "none";
        }
    }
}


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
// DOWNLOAD EXPENSES AS PDF — PREMIUM FEATURE
// =====================================================

const downloadExpensesBtn = document.getElementById("downloadExpensesBtn");

if (downloadExpensesBtn) {
    downloadExpensesBtn.addEventListener("click", () => {

        // 1. Check premium membership
        if (!user || user.isPrime !== true) {
            alert("Please buy Premium Membership to download your expenses.");
            return;
        }

        // 2. Check whether expenses exist
        if (expensesCache.length === 0) {
            alert("No expenses available to download.");
            return;
        }

        // 3. Check whether PDF libraries are loaded
        if (
            !window.jspdf ||
            typeof window.jspdf.jsPDF !== "function"
        ) {
            alert("PDF library not loaded. Please refresh the page.");
            return;
        }

        try {
            // 4. Create PDF
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            // 5. Add report title
            doc.setFontSize(20);
            doc.setFont("helvetica", "bold");

            doc.text("EXPENSE REPORT", 105, 20, {
                align: "center"
            });

            // 6. Add user and report information
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");

            doc.text(`User: ${user.name || "User"}`, 14, 32);

            doc.text(
                `Generated On: ${new Date().toLocaleDateString("en-IN")}`,
                14,
                39
            );

            doc.text(
                `Total Records: ${expensesCache.length}`,
                14,
                46
            );

            // 7. Calculate total expenses
            const totalAmount = expensesCache.reduce(
                (sum, expense) => sum + Number(expense.amount || 0),
                0
            );

            // 8. Prepare table rows
            const tableRows = expensesCache.map(expense => [
                String(expense.name ?? ""),
                String(expense.date ?? ""),
                String(expense.title ?? ""),
                String(expense.category ?? ""),
                `Rs. ${Number(expense.amount || 0).toFixed(2)}`
            ]);

            // 9. Generate formatted expense table
            doc.autoTable({
                startY: 55,

                head: [[
                    "Name",
                    "Date",
                    "Title",
                    "Category",
                    "Amount"
                ]],

                body: tableRows,

                theme: "grid",

                styles: {
                    fontSize: 9,
                    cellPadding: 3,
                    overflow: "linebreak"
                },

                headStyles: {
                    fillColor: [41, 98, 255],
                    textColor: 255,
                    fontStyle: "bold"
                },

                columnStyles: {
                    0: { cellWidth: 32 },
                    1: { cellWidth: 27 },
                    2: { cellWidth: 45 },
                    3: { cellWidth: 35 },
                    4: { cellWidth: 37, halign: "right" }
                },

                margin: {
                    left: 14,
                    right: 14,
                    bottom: 20
                },

                // Add page numbers and footer
                didDrawPage: function () {
                    const pageHeight = doc.internal.pageSize.height;
                    const pageNumber =
                        doc.internal.getCurrentPageInfo().pageNumber;

                    doc.setFontSize(9);
                    doc.setFont("helvetica", "normal");

                    doc.text("Expense Report", 14, pageHeight - 10);

                    doc.text(
                        `Page ${pageNumber}`,
                        196,
                        pageHeight - 10,
                        { align: "right" }
                    );
                }
            });

            // 10. Add total expenses after the table
            let finalY = doc.lastAutoTable.finalY + 12;

            if (finalY > doc.internal.pageSize.height - 20) {
                doc.addPage();
                finalY = 20;
            }

            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");

            doc.text(
                `TOTAL EXPENSES: Rs. ${totalAmount.toFixed(2)}`,
                14,
                finalY
            );

            // 11. Download the PDF
            doc.save("Expense_Report.pdf");

        } catch (error) {
            console.error("PDF Download Error:", error);

            alert("Unable to generate PDF. Please try again.");
        }
    });
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
// LEADERBOARD
// =====================================================

const leaderboardBtn =
    document.getElementById("leaderboardBtn");

const leaderboardSection =
    document.getElementById("leaderboardSection");

const leaderboardTable =
    document.getElementById("leaderboardTable");


if (leaderboardBtn) {

    leaderboardBtn.addEventListener(
        "click",
        async () => {

            try {

                const response =
                    await apiFetch(
                        "/api/leaderboard"
                    );


                if (!response) return;


                const data =
                    await response.json();


                if (!response.ok) {

                    alert(
                        data.message ||
                        "Unable to fetch leaderboard"
                    );

                    return;
                }


                // Show leaderboard section
                leaderboardSection.style.display =
                    "block";


                // Get table body
                const tbody =
                    leaderboardTable.querySelector(
                        "tbody"
                    );


                // Clear previous data
                tbody.innerHTML = "";


                // Add leaderboard data
                data.leaderboard.forEach(
                    (item, index) => {

                        const row =
                            document.createElement("tr");


                        // Rank
                        const rankCell =
                            document.createElement("td");

                        rankCell.textContent =
                            index + 1;


                        // Name from Expense.name
                        const nameCell =
                            document.createElement("td");

                        nameCell.textContent =
                            item.name;


                        // Total expense
                        const amountCell =
                            document.createElement("td");

                        amountCell.textContent =
                            `₹${Number(
                                item.totalExpense
                            ).toFixed(2)}`;


                        row.appendChild(
                            rankCell
                        );

                        row.appendChild(
                            nameCell
                        );

                        row.appendChild(
                            amountCell
                        );


                        tbody.appendChild(row);

                    }
                );

            } catch (error) {

                console.error(
                    "Leaderboard Error:",
                    error
                );


                alert(
                    "Something went wrong while loading leaderboard"
                );

            }

        }
    );

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
                    // and leaderboard button
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