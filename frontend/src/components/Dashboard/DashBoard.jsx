import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DasHBoard.css";
import StatsCards from "./Stats";
import ProfileSection from "./Profile";
import UploadsSection from "./Uploads";
import BookmarksSection from "./BookMarks";
import BoardsSection from "./BoardsSection";

const Dashboard = () => {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleUploadClick = () => {
    navigate("/upload-artworks");
  };

  const handleHomeClick = () => {
    navigate("/gallery");
  };

  const handleLogout = () => {
    setShowLogoutModal(true); // Show confirmation modal
  };

 const confirmLogout = async () => {
  try {
    // Call backend logout API
    const res = await fetch("http://localhost:8000/api/v1/user/logout", {
      method: "POST",
      credentials: "include", // important if you're using cookies/sessions
    });

    if (res.ok) {
      // Clear localStorage or tokens if used
      localStorage.removeItem("authToken");
      sessionStorage.removeItem("authToken");

      // Optional: Clear any app state (like user context)
      console.log("User logged out successfully.");

      // Hide modal and navigate away
      setShowLogoutModal(false);
      navigate("/"); // redirect to home/login
    } else {
      const data = await res.json();
      console.error("Logout failed:", data.message);
      alert("Logout failed: " + data.message);
    }
  } catch (err) {
    console.error("Error logging out:", err);
    alert("An error occurred during logout");
  }
};

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1
          className="homiee"
          onClick={handleHomeClick}
          style={{ cursor: "pointer" }}
        >
          Home
        </h1>

        <div className="header-buttons">
          <button className="upload-btn" onClick={handleUploadClick}>
            Upload New Artwork
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="d-left">
          <ProfileSection />
        </div>

        <div className="d-right">
          <StatsCards />
          <UploadsSection />
          <BookmarksSection />
           <BoardsSection /> 
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Are you sure you want to log out?</h3>
            <div className="modal-buttons">
              <button className="confirm-btn" onClick={confirmLogout}>
                Yes, Log Out
              </button>
              <button className="cancel-btn" onClick={cancelLogout}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;