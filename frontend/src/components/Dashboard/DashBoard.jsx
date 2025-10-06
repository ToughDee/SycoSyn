import React from "react";
import { useNavigate } from "react-router-dom";

import "./DasHBoard.css";
import StatsCards from "./Stats";
import ProfileSection from "./Profile";
import UploadsSection from "./Uploads";
import BookmarksSection from "./BookMarks";
import UploadArtForm from "./UploadArt";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleUploadClick = () => {
    navigate("/upload-artworks");
  };

  const handleHomeClick = () => {
    navigate("/gallery");
  };

  const handleLogout = () => {
 
    navigate("/");
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
        </div>
      </div>
    </div>
  );
};

export default Dashboard;