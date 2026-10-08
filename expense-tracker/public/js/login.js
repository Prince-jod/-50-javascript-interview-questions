const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      form.reset();
      window.location.href = "/dashboard";
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error("Login Error:", error);
    alert("Something went wrong.");
  }
});
// Forgot Password

const forgotPasswordBtn = document.getElementById("forgotPasswordBtn");
const forgotPasswordForm = document.getElementById("forgotPasswordForm");
const forgotSubmitBtn = document.getElementById("forgotSubmitBtn");

forgotPasswordBtn.addEventListener("click", (e) => {
  e.preventDefault();

  forgotPasswordForm.style.display = "block";
});

forgotSubmitBtn.addEventListener("click", async () => {

  const email = document.getElementById("forgotEmail").value.trim();

  if (!email) {
    alert("Please enter your email");
    return;
  }

  try {

    const response = await axios.post("/api/password/forgetpassword", {
      email: email
    });

    console.log(response.data);

    alert(response.data.message);

  } catch (error) {

    console.error("Forgot Password Error:", error);

    alert(
      error.response?.data?.message ||
      "Something went wrong."
    );
  }
});
