import React, { useState, useRef } from "react";
import "./prof.css";
import { FaCamera } from "react-icons/fa";

const ProfileSection = () => {
  const fileInputRef = useRef(null);

  // Initial user data
  const [user, setUser] = useState({
    name: "Sumeet Bhalerao",
    email: "john.doe@example.com",
    location: "Pune, mh",
    avatar: "./assets/images/user-prof.webp",
    bio: "Digital artist passionate about abstract and contemporary art.",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState(user.avatar);

  // Toggle edit mode
  const handleEditClick = () => {
    setIsEditing(!isEditing);
    setPreviewAvatar(user.avatar); // reset preview when editing
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewAvatar(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Trigger file input click
  const handleCameraClick = () => {
    fileInputRef.current.click();
  };

  // Save changes
  const handleSave = () => {
    setUser({ ...user, avatar: previewAvatar });
    setIsEditing(false);
  };

  return (
    <div className="profile-card">
     
     
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

      <h3 className="profile-name">
        {isEditing ? (
          <input
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
          <span className="profile-icon">✉️</span>
          {isEditing ? (
            <input
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
          ) : (
            user.email
          )}
        </div>
        <div className="profile-item">
          <span className="profile-icon">📍</span>
          {isEditing ? (
            <input
              type="text"
              value={user.location}
              onChange={(e) =>
                setUser({ ...user, location: e.target.value })
              }
            />
          ) : (
            user.location
          )}
        </div>
      </div>

      <p className="profile-bio">
        {isEditing ? (
          <textarea
            value={user.bio}
            onChange={(e) => setUser({ ...user, bio: e.target.value })}
          />
        ) : (
          user.bio
        )}
      </p>

      <button
        className="edit-btn"
        onClick={isEditing ? handleSave : handleEditClick}
      >
        {isEditing ? "Save Changes" : "Edit Profile"}
      </button>
    </div>
  );
};

export default ProfileSection;