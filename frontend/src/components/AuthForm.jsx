import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function AuthForm1() {
  const navigate = useNavigate();

  const [isActive, setIsActive] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Refs for login
  const loginUsernameRef = useRef();
  const loginPasswordRef = useRef();

  // Refs for register
  const registerUsernameRef = useRef();
  const registerEmailRef = useRef();
  const registerPasswordRef = useRef();

  // ✅ Google Sign-In logic
  useEffect(() => {
    /* global google */
    if (window.google) {
      google.accounts.id.initialize({
        client_id: "YOUR_GOOGLE_CLIENT_ID_HERE", // <-- Replace with your OAuth Client ID
        callback: handleGoogleResponse,
      });

      google.accounts.id.renderButton(
        document.getElementById("google-signin-btn"),
        { theme: "filled_blue", size: "large", text: "continue_with" }
      );
    }
  }, []);

  const handleGoogleResponse = async (response) => {
    try {
      const token = response.credential; // This is the Google ID token (JWT)
      setLoading(true);

      const res = await fetch("http://localhost:8000/api/v1/user/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
        credentials: "include",
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        setMessage("✅ Google login successful!");
        setTimeout(() => navigate("/gallery"), 1000);
      } else {
        setMessage("❌ Google login failed: " + data.message);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Google login failed");
      setLoading(false);
    }
  };

  // ✅ Normal login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/v1/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: loginUsernameRef.current.value,
          password: loginPasswordRef.current.value,
        }),
        credentials: "include",
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        setMessage("✅ Login successful!");
        setTimeout(() => navigate("/gallery"), 1000);
      } else {
        setMessage("❌ Login failed: " + data.message);
      }
    } catch (err) {
      setLoading(false);
      setMessage("❌ Login failed");
    }
  };

  // ✅ Registration
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const email = registerEmailRef.current.value;
    const username = registerUsernameRef.current.value;
    const password = registerPasswordRef.current.value;

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage("❌ Invalid email format");
      setLoading(false);
      return;
    }

    // Password validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    if (!passwordRegex.test(password)) {
      setMessage(
        "❌ Password must be at least 8 characters, include uppercase, lowercase, number, and special character"
      );
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/v1/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password }),
      });

      const data = await res.json();
      setLoading(false);
      if (res.ok) setMessage("✅ Registered successfully!");
      else setMessage("❌ Registration failed: " + data.message);
    } catch (err) {
      setLoading(false);
      setMessage("❌ Registration failed");
    }
  };

  return (
    <div className={`auth1-container ${isActive ? "active-1" : ""}`}>
      <button className="back-btn-1" onClick={() => navigate("/")}>
        <i className="bx bx-arrow-back"></i> Back
      </button>

      {/* ---------- LOGIN FORM ---------- */}
      <div className="form-box-1 login-1">
        <form onSubmit={handleLoginSubmit}>
          <h1>Login</h1>

          <div className="input-box-1">
            <input
              type="text"
              placeholder="Username"
              ref={loginUsernameRef}
              required
            />
            <i className="bx bxs-user"></i>
          </div>

          <div className="input-box-1">
            <input
              type="password"
              placeholder="Password"
              ref={loginPasswordRef}
              required
            />
            <i className="bx bx-lock-alt"></i>
          </div>

      

          <button type="submit" className="btn-1" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <p>or login with</p>

          <div className="social-icons-1">
            {/* ✅ Google Sign-In button mounts here */}
            <div id="google-signin-btn"></div>
          </div>
        </form>
      </div>

      {/* ---------- REGISTER FORM ---------- */}
      <div className="form-box-1 register-1">
        <form onSubmit={handleRegisterSubmit}>
          <h1>Register</h1>

          <div className="input-box-1">
            <input
              type="text"
              placeholder={`Username`}
              ref={registerUsernameRef}
              required
            />
            <i className="bx bxs-user"></i>
          </div>

          <div className="input-box-1">
            <input
              type="email"
              placeholder="Email"
              ref={registerEmailRef}
              required
            />
            <i className="bx bxs-envelope"></i>
          </div>

          <div className="input-box-1">
            <input
              type="password"
              placeholder="Password"
              ref={registerPasswordRef}
              required
            />
            <i className="bx bx-lock-alt"></i>
          </div>

          <button type="submit" className="btn-1" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>

          <p>or register with</p>

          <div className="social-icons-1">
            <div id="google-signin-btn"></div>
          </div>
        </form>
      </div>

      {/* ---------- TOGGLE BOX ---------- */}
      <div className="toggle-box-1">
        <div className="toggle-panel-1 toggle-left-1">
          <h1>Hello, Welcome!</h1>
          <p>Don't have an account?</p>
          <button
            type="button"
            className="btn-1 register-btn-1"
            onClick={() => setIsActive(true)}
          >
            Register
          </button>
        </div>
        <div className="toggle-panel-1 toggle-right-1">
          <h1>Welcome Back!</h1>
          <p>Already have an account?</p>
          <button
            type="button"
            className="btn-1 login-btn-1"
            onClick={() => setIsActive(false)}
          >
            Login
          </button>
        </div>
      </div>

      {message && (
        <p
          className={`form-message-1 ${
            message.startsWith("✅") ? "success" : "error"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}