import React, { useState, useEffect, useContext } from "react";
import {
  FaArrowLeft,
  FaEnvelope,
  FaMapMarkerAlt,
  FaHeart,
  FaEye,

} from "react-icons/fa";
import { FaCamera } from "react-icons/fa";
import { BiSolidBookmarkStar } from "react-icons/bi";
import { useNavigate, useParams } from "react-router-dom";
import { BookmarksContext } from "../../Store/BookmarksContext";
import "./UserProfile.css";

const UserProfile = () => {
  const navigate = useNavigate();
  const { bookmarks, dispatchBookmarks } = useContext(BookmarksContext);
  const { userId } = useParams();

  const [user, setUser] = useState(null);
  const [uploads, setUploads] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/v1/user/c/${userId}`,
          { credentials: "include" }
        );
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();

        setUser({
          name: data.data.user.fullname,
          email: data.data.user.email,
          location: data.data.user.location,
          avatar: data.data.user.avatar,
          bio: data.data.user.bio,
          uploadsCount: data.data.totalUploads,
          likesCount: data.data.totalLikes,
          viewsCount: data.data.totalViews,
        });

        // Initialize uploads with like/bookmark states
        setUploads(
          data.data.uploads.map((upload) => ({
            ...upload,
            isLiked: upload.likedByUser,
            likesCount: upload.likes,
            isBookmarked: bookmarks.some((b) => b.id === upload._id),
          }))
        );
      } catch (err) {
        console.error(err);
        alert("Failed to load user profile.");
      }
    };

    fetchUser();
  }, [userId, bookmarks]);

  const handleLike = async (uploadId) => {
    setUploads((prev) =>
      prev.map((u) =>
        u._id === uploadId
          ? {
              ...u,
              isLiked: !u.isLiked,
              likesCount: u.isLiked ? u.likesCount - 1 : u.likesCount + 1,
            }
          : u
      )
    );

    try {
      await fetch(
        `http://localhost:8000/api/v1/like/toggle/a/${uploadId}`,
        { method: "POST", credentials: "include" }
      );
    } catch (err) {
      console.error(err);
      // rollback on failure
      setUploads((prev) =>
        prev.map((u) =>
          u._id === uploadId
            ? {
                ...u,
                isLiked: !u.isLiked,
                likesCount: u.isLiked ? u.likesCount - 1 : u.likesCount + 1,
              }
            : u
        )
      );
    }
  };

  const handleBookmark = async (upload) => {
    const alreadyBookmarked = bookmarks.some((b) => b.id === upload._id);

    setUploads((prev) =>
      prev.map((u) =>
        u._id === upload._id ? { ...u, isBookmarked: !alreadyBookmarked } : u
      )
    );

    try {
      await fetch(
        `http://localhost:8000/api/v1/art/bookmark/toggle/${upload._id}`,
        { method: "POST", credentials: "include" }
      );

      if (alreadyBookmarked) {
        dispatchBookmarks({ type: "REMOVE_BOOKMARK", payload: upload._id });
      } else {
        dispatchBookmarks({
          type: "ADD_BOOKMARK",
          payload: {
            id: upload._id,
            title: upload.name || "Untitled",
            artist: user.name,
            image: upload.content,
            likes: upload.likesCount,
          },
        });
      }
    } catch (err) {
      console.error(err);
      // rollback
      setUploads((prev) =>
        prev.map((u) =>
          u._id === upload._id ? { ...u, isBookmarked: alreadyBookmarked } : u
        )
      );
    }
  };

  const handleUserClick = () => navigate(`/user/${userId}`);

  if (!user) return <p>Loading user profile...</p>;

  return (
    <div className="up-user-profile-page">
      {/* Header */}
      <div className="up-user-header">
        <button className="up-back-btn" onClick={() => navigate(-1)}>
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

      {/* Uploaded Artworks */}
      <div className="up-user-uploads-section">
        <h3>Uploaded Artworks</h3>
        {uploads.length > 0 ? (
          <div className="up-user-uploads-scroll">
            {uploads.map((upload) => (
              <div key={upload._id} className="up-user-upload-card">
                <div className="up-image-wrapper">
                  <img src={upload.content} alt={upload.name} />
                </div>
                <div className="up-upload-content">
                  <h3>{upload.name}</h3>
                  <div className="up-card-actions">
                    <button
                      className={`g1-like-btn ${upload.isLiked ? "liked" : ""}`}
                      onClick={() => handleLike(upload._id)}
                    >
                      <FaHeart /> {upload.likesCount}
                    </button>
                    <button
                      className={`g1-bookmark-btn ${
                        upload.isBookmarked ? "bookmarked" : ""
                      }`}
                      onClick={() => handleBookmark(upload)}
                    >
                      <BiSolidBookmarkStar />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="up-no-uploads-msg">No uploads yet.</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;