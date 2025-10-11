import React, { useContext } from "react";
import "./Gallery.css";
import { FaRegCircleUser } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../Store/UserContext"; // ✅ added

const TopBar = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext); // ✅ use context

  const handleProfileClick = () => {
    navigate("/user-profile");
  };

  return (
    <div className="g1-top-bar">
      <h2 className="g1-gallery-title">Art-Echo</h2>
      <button className="g1-profile-btn" onClick={handleProfileClick}>
        {user.avatar ? (
          <img
            src={user.avatar}
            alt="profile"
            className="g1-profile-icon"
            style={{
              width: "35px",
              height: "35px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        ) : (
          <FaRegCircleUser />
        )}
      </button>
    </div>
  );
};

export default TopBar;