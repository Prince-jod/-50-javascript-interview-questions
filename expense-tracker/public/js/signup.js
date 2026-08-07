const form = document.getElementById("signupForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Account created! Please login.");
      form.reset();
      window.location.href = "login.html";
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error("Signup Error:", error);
    alert("Something went wrong.");
  }
});
