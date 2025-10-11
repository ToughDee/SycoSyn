import React, { useState, useRef, useEffect, useContext } from "react";
import "./prof.css";
import { FaCamera } from "react-icons/fa";
import { MdEmail, MdLocationOn } from "react-icons/md";
import { UserContext } from "../../Store/UserContext"; // ✅ added

const ProfileSection = () => {
  const fileInputRef = useRef(null);
  const { user, setUser } = useContext(UserContext); // ✅ use context

  const defaultUser = {
    name: `name`,
    email: "email here",
    location: "city,state",
    avatar: "./assets/images/user-prof.webp",
    bio: "Update bio",
    username: "Username",
  };

  const [isEditing, setIsEditing] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState(user?.avatar || defaultUser.avatar);
  const [selectedFile, setSelectedFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [popupMsg, setPopupMsg] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  // Fetch current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/v1/user/current-user", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        const currentUser = data.data;

        setUser((prev) => ({
          ...prev,
          name: currentUser.fullname || prev.name,
          email: currentUser.email || prev.email,
          location: currentUser.location || prev.location,
          avatar: currentUser.avatar || prev.avatar,
          bio: currentUser.bio || prev.bio,
          username: currentUser.username || prev.username,
        }));

        setPreviewAvatar(currentUser.avatar || defaultUser.avatar);
      } catch (err) {
        console.error("Failed to fetch current user:", err);
      }
    };

    fetchCurrentUser();
  }, [setUser]);

  const handleEditClick = () => {
    setIsEditing(true);
    setPreviewAvatar(user.avatar);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewAvatar(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCameraClick = () => fileInputRef.current.click();

  const handleSave = async () => {
    setSaving(true);
    try {
      // Update avatar first if changed
      if (selectedFile) {
        const formData = new FormData();
        formData.append("avatar", selectedFile);

        const avatarRes = await fetch("http://localhost:8000/api/v1/user/avatar", {
          method: "PATCH",
          credentials: "include",
          body: formData,
        });

        if (!avatarRes.ok) throw new Error("Failed to update avatar");
        const avatarData = await avatarRes.json();

        setUser((prev) => ({ ...prev, avatar: avatarData.data.avatar })); // ✅ update context
      }

      // Update other user details
      const userDetails = {
        fullname: user.name,
        email: user.email,
        location: user.location,
        bio: user.bio,
      };

      const detailsRes = await fetch("http://localhost:8000/api/v1/user/update-account", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userDetails),
      });

      if (!detailsRes.ok) throw new Error("Failed to update user details");

      const updatedUser = await detailsRes.json();
      setUser((prev) => ({
        ...prev,
        name: updatedUser.data.fullname,
        email: updatedUser.data.email,
        location: updatedUser.data.location,
        bio: updatedUser.data.bio,
        avatar: updatedUser.data.avatar || prev.avatar,
      }));

      setIsEditing(false);
      setSelectedFile(null);
      setPreviewAvatar(updatedUser.data.avatar || previewAvatar);

      setPopupMsg("Profile updated successfully!");
      setShowPopup(true);
    } catch (err) {
      console.error(err);
      setPopupMsg("Failed to save changes. Please try again.");
      setShowPopup(true);
    } finally {
      setSaving(false);
    }
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
          <h3 className="profile-username-below">{user.username}</h3>
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
            disabled={saving}
          >
            {isEditing ? (saving ? "Saving..." : "Save Changes") : "Edit Profile"}
          </button>
        </div>
      </div>

      {showPopup && (
        <div className="popup-overlay1">
          <div className="popup-box1">
            <p>{popupMsg}</p>
            <button onClick={() => setShowPopup(false)}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSection;