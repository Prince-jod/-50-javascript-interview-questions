import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import css from "../css/login.css?inline";
import useStyle from "../useStyle";
import { saveSession } from "../api";

export default function Login() {
  useStyle(css);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await response.json();

      if (response.ok) {
        saveSession(data.token, data.user);
        setEmail("");
        setPassword("");
        navigate("/dashboard");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("Something went wrong.");
    }
  }

  async function handleForgotSubmit() {
    const value = forgotEmail.trim();
    if (!value) {
      alert("Please enter your email");
      return;
    }
    try {
      const response = await fetch("/api/password/forgetpassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value }),
      });
      const data = await response.json();
      alert(data.message || "Something went wrong.");
    } catch (error) {
      console.error("Forgot Password Error:", error);
      alert("Something went wrong.");
    }
  }

  return (
    <form id="loginForm" onSubmit={handleLogin}>
      <h2>Login</h2>

      <input
        type="email"
        id="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        id="password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit">Login</button>

      {/* Forgot Password */}
      <p>
        <a
          href="#"
          id="forgotPasswordBtn"
          onClick={(e) => {
            e.preventDefault();
            setShowForgot(true);
          }}
        >
          Forgot Password?
        </a>
      </p>

      {showForgot && (
        <div id="forgotPasswordForm">
          <input
            type="email"
            id="forgotEmail"
            placeholder="Enter your email"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
          />
          <button type="button" id="forgotSubmitBtn" onClick={handleForgotSubmit}>
            Send Reset Link
          </button>
        </div>
      )}

      <p>
        Don't have an account? <Link to="/signup">Register</Link>
      </p>
    </form>
  );
}
