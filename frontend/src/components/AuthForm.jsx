import React, { useState, useRef } from "react";
import "../App.css";

export default function AuthForm() {
  const [isActive, setIsActive] = useState(false); // toggle login/register
  const [message, setMessage] = useState(""); // success/error messages
  const [loading, setLoading] = useState(false);

  // Refs for login inputs
  const loginUsernameRef = useRef();
  const loginPasswordRef = useRef();

  // Refs for register inputs
  const registerUsernameRef = useRef();
  const registerEmailRef = useRef();
  const registerPasswordRef = useRef();

  // Login submit handler
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const loginData = {
      username: loginUsernameRef.current.value,
      password: loginPasswordRef.current.value,
    };

    try {
      
      const res = await fetch("http://localhost:8000/api/v1/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: loginData.username, 
          password: loginData.password,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        setMessage("Login successful! Token: " + data.data.accessToken);
      } else {
        setMessage("Login failed: " + data.message);
      }
    } catch (err) {
      setLoading(false);
      setMessage("Login failed: " + err.message);
    }
  };

  // Register submit handler
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const registerData = {
      username: registerUsernameRef.current.value,
      email: registerEmailRef.current.value,
      password: registerPasswordRef.current.value,
    };

    try {
      // Using fake API endpoint for registration
      const res = await fetch("http://localhost:8000/api/v1/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: registerData.username,
          email: registerData.email,
          password: registerData.password,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        setMessage("Registration successful! ID: " + data.data._id);
      } else {
        setMessage("Registration failed: " + data.message);
      }
    } catch (err) {
      setLoading(false);
      setMessage("Registration failed: " + err.message);
    }
  };

  return (
    <div className={`container ${isActive ? "active" : ""}`}>
      {/* Login Form */}
      <div className="form-box login">
        <form onSubmit={handleLoginSubmit}>
          <h1>Login</h1>

          <div className="input-box">
            <input
              type="text"
              placeholder="Username"
              ref={loginUsernameRef}
              required
            />
            <i className="bx bxs-user"></i>
          </div>

          <div className="input-box">
            <input
              type="password"
              placeholder="Password"
              ref={loginPasswordRef}
              required
            />
            <i className="bx bx-lock-alt"></i>
          </div>

          <div className="forgot-link">
            <a href="#">Forgot password?</a>
          </div>

          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <p>or login with social platforms</p>

          <div className="social-icons">
            <a href="#"><i className="bx bxl-google"></i></a>
            <a href="#"><i className="bx bxl-facebook"></i></a>
            <a href="#"><i className="bx bxl-github"></i></a>
            <a href="#"><i className="bx bxl-linkedin"></i></a>
          </div>
        </form>
      </div>

      {/* Register Form */}
      <div className="form-box register">
        <form onSubmit={handleRegisterSubmit}>
          <h1>Register</h1>

          <div className="input-box">
            <input
              type="text"
              placeholder="Username"
              ref={registerUsernameRef}
              required
            />
            <i className="bx bxs-user"></i>
          </div>

          <div className="input-box">
            <input
              type="email"
              placeholder="Email"
              ref={registerEmailRef}
              required
            />
            <i className="bx bxs-envelope"></i>
          </div>

          <div className="input-box">
            <input
              type="password"
              placeholder="Password"
              ref={registerPasswordRef}
              required
            />
            <i className="bx bx-lock-alt"></i>
          </div>

          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>

          <p>or register with social platforms</p>

          <div className="social-icons">
            <a href="#"><i className="bx bxl-google"></i></a>
            <a href="#"><i className="bx bxl-facebook"></i></a>
            <a href="#"><i className="bx bxl-github"></i></a>
            <a href="#"><i className="bx bxl-linkedin"></i></a>
          </div>
        </form>
      </div>

      {/* Toggle Panels */}
      <div className="toggle-box">
        <div className="toggle-panel toggle-left">
          <h1>Hello, Welcome!</h1>
          <p>Don't have an account?</p>
          <button
            type="button"
            className="btn register-btn"
            onClick={() => setIsActive(true)}
          >
            Register
          </button>
        </div>
        <div className="toggle-panel toggle-right">
          <h1>Welcome Back!</h1>
          <p>Already have an account?</p>
          <button
            type="button"
            className="btn login-btn"
            onClick={() => setIsActive(false)}
          >
            Login
          </button>
        </div>
      </div>

      {/* Message Display */}
      {message && <p className="form-message">{message}</p>}
    </div>
  );
}