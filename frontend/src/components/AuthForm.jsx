import React, { useState, useRef } from "react";
import "../App.css";

export default function AuthForm1() {
  const [isActive, setIsActive] = useState(false); // toggle login/register
  const [message, setMessage] = useState(""); 
  const [loading, setLoading] = useState(false);

  // Login refs
  const loginUsernameRef = useRef();
  const loginPasswordRef = useRef();

  // Register refs
  const registerUsernameRef = useRef();
  const registerEmailRef = useRef();
  const registerPasswordRef = useRef();

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
      });

      const data = await res.json();
      setLoading(false);
      if (res.ok) setMessage("Login successful! Token: " + data.data.accessToken);
      else setMessage("Login failed: " + data.message);
    } catch (err) {
      setLoading(false);
      setMessage("Login failed: " + err.message);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/v1/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: registerEmailRef.current.value,
          username: registerUsernameRef.current.value,
          password: registerPasswordRef.current.value,
        }),
      });

      const data = await res.json();
      setLoading(false);
      if (res.ok) setMessage("Registration successful! ID: " + data.data._id);
      else setMessage("Registration failed: " + data.message);
    } catch (err) {
      setLoading(false);
      setMessage("Registration failed: " + err.message);
    }
  };

  return (
    <div className={`auth1-container ${isActive ? "active-1" : ""}`}>
      {/* Login Form */}
      <div className="form-box-1 login-1">
        <form onSubmit={handleLoginSubmit}>
          <h1>Login</h1>

          <div className="input-box-1">
            <input type="text" placeholder="Username" ref={loginUsernameRef} required />
            <i className="bx bxs-user"></i>
          </div>

          <div className="input-box-1">
            <input type="password" placeholder="Password" ref={loginPasswordRef} required />
            <i className="bx bx-lock-alt"></i>
          </div>

          <div className="forgot-link-1">
            <a href="#">Forgot password?</a>
          </div>

          <button type="submit" className="btn-1" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <p>or login with social platforms</p>

          <div className="social-icons-1">
            <a href="#"><i className="bx bxl-google"></i></a>
            <a href="#"><i className="bx bxl-facebook"></i></a>
            <a href="#"><i className="bx bxl-github"></i></a>
            <a href="#"><i className="bx bxl-linkedin"></i></a>
          </div>
        </form>
      </div>

      {/* Register Form */}
      <div className="form-box-1 register-1">
        <form onSubmit={handleRegisterSubmit}>
          <h1>Register</h1>

          <div className="input-box-1">
            <input type="text" placeholder="Username" ref={registerUsernameRef} required />
            <i className="bx bxs-user"></i>
          </div>

          <div className="input-box-1">
            <input type="email" placeholder="Email" ref={registerEmailRef} required />
            <i className="bx bxs-envelope"></i>
          </div>

          <div className="input-box-1">
            <input type="password" placeholder="Password" ref={registerPasswordRef} required />
            <i className="bx bx-lock-alt"></i>
          </div>

          <button type="submit" className="btn-1" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>

          <p>or register with social platforms</p>

          <div className="social-icons-1">
            <a href="#"><i className="bx bxl-google"></i></a>
            <a href="#"><i className="bx bxl-facebook"></i></a>
            <a href="#"><i className="bx bxl-github"></i></a>
            <a href="#"><i className="bx bxl-linkedin"></i></a>
          </div>
        </form>
      </div>

      {/* Toggle Panels */}
      <div className="toggle-box-1">
        <div className="toggle-panel-1 toggle-left-1">
          <h1>Hello, Welcome!</h1>
          <p>Don't have an account?</p>
          <button type="button" className="btn-1 register-btn-1" onClick={() => setIsActive(true)}>
            Register
          </button>
        </div>
        <div className="toggle-panel-1 toggle-right-1">
          <h1>Welcome Back!</h1>
          <p>Already have an account?</p>
          <button type="button" className="btn-1 login-btn-1" onClick={() => setIsActive(false)}>
            Login
          </button>
        </div>
      </div>

      {message && <p className="form-message-1">{message}</p>}
    </div>
  );
}