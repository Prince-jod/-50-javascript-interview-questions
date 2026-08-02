const form = document.getElementById("userForm");
const userList = document.getElementById("userList");

let editUserId = null;

// Get all users
async function getUsers() {
    try {
        const res = await fetch("/users");
        const users = await res.json();

        userList.innerHTML = "";

        users.forEach((user) => {
            userList.innerHTML += `
                <tr>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.phone}</td>

                    <td>
                        <button class="edit-btn" onclick="editUser(${user.id}, '${user.name}', '${user.email}', '${user.phone}')">
                            Edit
                        </button>

                        <button class="delete-btn" onclick="deleteUser(${user.id})">
                            Delete
                        </button>
                    </td>
                </tr>
            `;
        });

    } catch (err) {
        console.log(err);
    }
}

getUsers();


// Create or Update User
form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;

    const user = {
        name,
        email,
        phone
    };

    try {

        if (editUserId) {

            await fetch(`/users/${editUserId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user)
            });

            editUserId = null;

            form.querySelector("button").innerText = "Add User";

        } else {

            await fetch("/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user)
            });

        }

        form.reset();
        getUsers();

    } catch (err) {
        console.log(err);
    }

});


// Delete User
async function deleteUser(id) {

    await fetch(`/users/${id}`, {
        method: "DELETE"
    });

    getUsers();
}


// Edit User
function editUser(id, name, email, phone) {

    document.getElementById("name").value = name;
    document.getElementById("email").value = email;
    document.getElementById("phone").value = phone;

    editUserId = id;

    form.querySelector("button").innerText = "Update User";
}