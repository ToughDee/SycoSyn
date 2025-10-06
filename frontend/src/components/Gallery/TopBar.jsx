import React from "react";
import "./Gallery.css";
import { FaRegCircleUser } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const TopBar = () => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate("/user-profile");
  };

  return (
    <div className="g1-top-bar">
      <h2 className="g1-gallery-title">Art-Echo</h2>
      <button className="g1-profile-btn" onClick={handleProfileClick}>
        <FaRegCircleUser />
      </button>
    </div>
  );
};

export default TopBar;