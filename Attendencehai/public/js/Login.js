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

    alert(data.message);

    if (response.ok) {
      // JWT will be stored here later
      // localStorage.setItem("token", data.token);

      form.reset();
    }
  } catch (error) {
    console.error("Login Error:", error);
    alert("Something went wrong.");
  }
});