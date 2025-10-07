import React, { useState, useRef } from "react";
import "./prof.css";
import { FaCamera } from "react-icons/fa";
import { MdEmail, MdLocationOn } from "react-icons/md"; // Import React icons

const ProfileSection = () => {
  const fileInputRef = useRef(null);

  const [user, setUser] = useState({
    name: "",
    email: "john.doe@example.com",
    location: "Pune, MH",
    avatar: "./assets/images/user-prof.webp",
    bio: "Digital artist passionate about abstract and contemporary art.",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState(user.avatar);

  const handleEditClick = () => {
    setIsEditing(!isEditing);
    setPreviewAvatar(user.avatar);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewAvatar(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCameraClick = () => fileInputRef.current.click();

  const handleSave = () => {
    setUser({ ...user, avatar: previewAvatar });
    setIsEditing(false);
  };

  return (
    <div className="profile-card">
      <div className="profile-content">
        {/* LEFT: Avatar */}
        <div className="profile-left">
          <div className="profile-avatar-wrapper">
            <img className="profile-avatar" src={previewAvatar} alt={user.name} />
            {isEditing && (
              <>
                <button className="camera-btn" onClick={handleCameraClick}>
                  <FaCamera />
                </button>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </>
            )}
          </div>
        </div>

        {/* RIGHT: Info */}
        <div className="profile-right">
          <h3 className="profile-name">
            {isEditing ? (
              <input
                className="profile-input"
                type="text"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
              />
            ) : (
              user.name
            )}
          </h3>

          <div className="profile-info">
            <div className="profile-item">
              <MdEmail className="profile-icon" />
              {isEditing ? (
                <input
                  className="profile-input"
                  type="email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                />
              ) : (
                user.email
              )}
            </div>
            <div className="profile-item">
              <MdLocationOn className="profile-icon" />
              {isEditing ? (
                <input
                  className="profile-input"
                  type="text"
                  value={user.location}
                  onChange={(e) => setUser({ ...user, location: e.target.value })}
                />
              ) : (
                user.location
              )}
            </div>
          </div>

          <p className="profile-bio">
            {isEditing ? (
              <textarea
                className="profile-textarea"
                value={user.bio}
                onChange={(e) => setUser({ ...user, bio: e.target.value })}
              />
            ) : (
              user.bio
            )}
          </p>

          <button
            className={`edit-btn ${isEditing ? "save-btn" : ""}`}
            onClick={isEditing ? handleSave : handleEditClick}
          >
            {isEditing ? "Save Changes" : "Edit Profile"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;