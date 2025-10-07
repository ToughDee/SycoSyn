import React, { useState, useContext } from "react";
import {
  FaArrowLeft,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCamera,
  FaHeart,
  FaEye,
} from "react-icons/fa";
import { BiSolidBookmarkStar } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { BookmarksContext } from "../../Store/BookmarksContext";
import "./UserProfile.css";

const tempUser = {
  name: "Sarah Johnson",
  email: "sarah.johnson@example.com",
  location: "New York, USA",
  avatar:
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
  bio: "Digital artist and illustrator passionate about surreal worlds and geometric compositions. 🎨✨",
  uploadsCount: 12,
  likesCount: 856,
  viewsCount: 1200,
  uploads: [
    {
      id: 7,
      title: "Cosmic Dreams",
      image:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=600&fit=crop",
      likes: 234,
      views: 400,
    },
    {
      id: 11,
      title: "Urban Mirage",
      image:
        "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&h=600&fit=crop",
      likes: 198,
      views: 320,
    },
    {
      id: 10,
      title: "Silent Echoes",
      image:
        "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&h=600&fit=crop",
      likes: 276,
      views: 500,
    },
  ],
};

const UserProfile = ({ user }) => {
  const navigate = useNavigate();
  const { bookmarks, dispatchBookmarks } = useContext(BookmarksContext);

  // Initialize upload state with likes and bookmark flags
  const [uploads, setUploads] = useState(
    user.uploads.map((upload) => ({
      ...upload,
      isLiked: false,
      likesCount: upload.likes,
    }))
  );

 
  const handleLike = (id) => {
    setUploads((prevUploads) =>
      prevUploads.map((u) =>
        u.id === id
          ? {
              ...u,
              isLiked: !u.isLiked,
              likesCount: u.isLiked ? u.likesCount - 1 : u.likesCount + 1,
            }
          : u
      )
    );
  };


  const handleBookmark = (upload) => {
    const alreadyBookmarked = bookmarks.some((b) => b.id === upload.id);

    if (alreadyBookmarked) {
      dispatchBookmarks({ type: "REMOVE_BOOKMARK", payload: upload.id });
    } else {
      const newBookmark = {
        id: upload.id,
        title: upload.title,
        artist: user.name,
        image: upload.image,
        likes: upload.likesCount,
      };
      dispatchBookmarks({ type: "ADD_BOOKMARK", payload: newBookmark });
    }

    // Optional: local feedback for bookmark toggling
    setUploads((prev) =>
      prev.map((u) =>
        u.id === upload.id
          ? { ...u, isBookmarked: !alreadyBookmarked }
          : u
      )
    );
  };

  return (
    <div className="up-user-profile-page">
      {/* Header */}
      <div className="up-user-header">
        <button className="up-back-btn" onClick={() => navigate("/gallery")}>
          <FaArrowLeft /> Back
        </button>
      </div>

      {/* Top Section */}
      <div className="up-user-top">
        <img src={user.avatar} alt={user.name} className="up-user-avatar" />
        <div className="up-user-info">
          <h1 className="up-user-name">{user.name}</h1>
          <div className="up-user-details">
            <p>
              <FaEnvelope className="up-user-icon" /> {user.email}
            </p>
            <p>
              <FaMapMarkerAlt className="up-user-icon" /> {user.location}
            </p>
          </div>
          <p className="up-user-bio">{user.bio}</p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="up-user-stats">
        <div className="up-user-stat-card">
          <FaCamera className="up-stat-icon" />
          <span className="up-stat-value">{user.uploadsCount}</span>
          <span className="up-stat-label">Uploads</span>
        </div>
        <div className="up-user-stat-card">
          <FaHeart className="up-stat-icon" />
          <span className="up-stat-value">{user.likesCount}</span>
          <span className="up-stat-label">Likes</span>
        </div>
        <div className="up-user-stat-card">
          <FaEye className="up-stat-icon" />
          <span className="up-stat-value">{user.viewsCount}</span>
          <span className="up-stat-label">Total Views</span>
        </div>
      </div>

      {/* Uploaded Artworks (Horizontal Scroll) */}
      <div className="up-user-uploads-section">
        <h3>Uploaded Artworks</h3>
        {uploads && uploads.length > 0 ? (
          <div className="up-user-uploads-scroll">
            {uploads.map((upload) => {
              const alreadyBookmarked = bookmarks.some(
                (b) => b.id === upload.id
              );

              return (
                <div key={upload.id} className="up-user-upload-card">
                  <div className="up-image-wrapper">
                    <img src={upload.image} alt={upload.title} />
                  </div>
                  <div className="up-upload-content">
                    <h3>{upload.title}</h3>

                    <div className="up-card-actions">
                      <button
                        className={`g1-like-btn ${
                          upload.isLiked ? "liked" : ""
                        }`}
                        onClick={() => handleLike(upload.id)}
                      >
                        <FaHeart /> {upload.likesCount}
                      </button>

                      <button
                        className={`g1-bookmark-btn ${
                          alreadyBookmarked ? "bookmarked" : ""
                        }`}
                        onClick={() => handleBookmark(upload)}
                      >
                        <BiSolidBookmarkStar />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="up-no-uploads-msg">No uploads yet.</p>
        )}
      </div>
    </div>
  );
};

const UserProfileTest = () => <UserProfile user={tempUser} />;

export default UserProfileTest;