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
  const [isLoggingOut, setIsLoggingOut] = useState(false); // ✅ new state

  const handleUploadClick = () => {
    navigate("/upload-artworks");
  };

  const handleCreateBoardClick = () => {
    navigate("/create-board");
  };

  const handleHomeClick = () => {
    navigate("/gallery");
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    setShowLogoutModal(false);
    setIsLoggingOut(true); // show loader

    try {
      // short delay for effect
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const res = await fetch("http://localhost:8000/api/v1/user/logout", {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        localStorage.removeItem("authToken");
        sessionStorage.removeItem("authToken");
        navigate("/"); // redirect to home/login
      } else {
        const data = await res.json();
        alert("Logout failed: " + data.message);
      }
    } catch (err) {
      console.error("Error logging out:", err);
      alert("An error occurred during logout");
    } finally {
      setIsLoggingOut(false); // hide loader
    }
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1 className="homiee" onClick={handleHomeClick} style={{ cursor: "pointer" }}>
          Home
        </h1>

        <div className="header-buttons">
          <button className="upload-btn" onClick={handleUploadClick}>
            Upload New Artwork
          </button>

          <button className="create-board-btn" onClick={handleCreateBoardClick}>
            + Create New Board
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

      {/* ✅ Logout confirmation modal */}
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

      {/* ✅ Logging out loader modal */}
      {isLoggingOut && (
        <div className="modal-overlay1">
          <div className="modal-content1 logging-out-modal">
            <div className="spinner1"></div>
            <h3>Logging out... please wait</h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;