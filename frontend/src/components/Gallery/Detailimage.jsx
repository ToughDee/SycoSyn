import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BookmarksContext } from "../../Store/BookmarksContext";
import { BoardsContext } from "../../Store/BoardContext";
import { FaHeart } from "react-icons/fa";
import { BiSolidBookmarkStar } from "react-icons/bi";

import "./Gallery.css";

const ImageDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { bookmarks, dispatchBookmarks } = useContext(BookmarksContext);
  const { boards, refreshBoards } = useContext(BoardsContext);

  const [imageData, setImageData] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [showBoardDropdown, setShowBoardDropdown] = useState(false);

  // ✅ Popup states
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  // ✅ Current user
  const [user, setUser] = useState(null);
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const userRes = await fetch("http://localhost:8000/api/v1/user/current-user", {
          credentials: "include",
        });
        const userData = await userRes.json();
        if (!userData.success) throw new Error("Failed to get user");
        setUser(userData.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCurrentUser();
  }, []);

  // Fetch image + comments
  useEffect(() => {
    const fetchData = async () => {
      try {
        const imageRes = await fetch(`http://localhost:8000/api/v1/art/${id}`, {
          credentials: "include",
          headers: { "Cache-Control": "no-cache" },
        });
        if (!imageRes.ok) throw new Error("Failed to fetch image");
        const imageJson = await imageRes.json();
        setImageData(imageJson.data.art);
        setIsLiked(imageJson.data.likedByUser || false);
        setLikesCount(imageJson.data.art.likes || 0);
        setIsBookmarked(imageJson.data.isBookmarked || false);

        const commentsRes = await fetch(`http://localhost:8000/api/v1/comments/${id}`, {
          credentials: "include",
          headers: { "Cache-Control": "no-cache" },
        });
        if (!commentsRes.ok) throw new Error("Failed to fetch comments");
        const commentsJson = await commentsRes.json();
        setComments(commentsJson.data?.comments || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, bookmarks]);

  // Like toggle
  const handleLike = async () => {
    try {
      const newLiked = !isLiked;
      setIsLiked(newLiked);
      setLikesCount((prev) => prev + (newLiked ? 1 : -1));

      const res = await fetch(`http://localhost:8000/api/v1/like/toggle/a/${id}`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        setIsLiked(!newLiked);
        setLikesCount((prev) => prev + (newLiked ? -1 : 1));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Bookmark toggle
  const handleBookmark = async () => {
    try {
      const newBookmark = !isBookmarked;
      setIsBookmarked(newBookmark);

      const res = await fetch(`http://localhost:8000/api/v1/art/bookmark/toggle/${id}`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        setIsBookmarked(!newBookmark);
        return;
      }

      if (newBookmark) {
        dispatchBookmarks({
          type: "ADD_BOOKMARK",
          payload: {
            id: imageData._id,
            title: imageData.name,
            artist: imageData.owner.username,
            image: imageData.content,
            likes: likesCount,
          },
        });
      } else {
        dispatchBookmarks({ type: "REMOVE_BOOKMARK", payload: imageData._id });
      }
    } catch (err) {
      console.error(err);
    }
  };

 // Import BoardsContext


const handleAddToBoard = async (boardId) => {
  try {
    const res = await fetch(
      `http://localhost:8000/api/v1/board/add/${imageData._id}/${boardId}`,
      {
        method: "PATCH",
        credentials: "include",
      }
    );
    const data = await res.json();
    if (!data.success) throw new Error(data.message || "Already added to board");

    // ✅ Refresh the boards in context so UI updates
    await refreshBoards();

    // ✅ Show popup
    setPopupMessage("Artwork added to board!");
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2000);

    setShowBoardDropdown(false);
  } catch (err) {
    console.error(err);
    setPopupMessage("Already Added");
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2000);
  }
};
  // Add comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const res = await fetch(`http://localhost:8000/api/v1/comments/${id}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment }),
      });

      if (!res.ok) throw new Error("Failed to post comment");
      const data = await res.json();
      setComments((prev) => [data.data, ...prev]);
      setNewComment("");
    } catch (err) {
      console.error(err);
    }
  };

  // Delete comment
  const handleDeleteComment = async (commentId) => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/comments/c/${commentId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to delete comment");
      setComments(prev => prev.filter(c => c._id !== commentId));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!imageData) return <p>No image found</p>;

  return (
    <div className="image-detail-page">
      {showPopup && <div className="popup-notification">{popupMessage}</div>}

      <div className="image-detail-header">
        <button onClick={() => navigate(-1)}>← Back</button>
      </div>

      <div className="image-section">
        <img src={imageData.content} alt={imageData.name} className="detail-image" />

        <div className="image-info-row">
          <h2 className="image-title">{imageData.name}</h2>
          <div className="image-actions">
            <button className={isLiked ? "liked" : ""} onClick={handleLike}>
              <FaHeart /> {likesCount}
            </button>
            <button className={isBookmarked ? "bookmarked" : ""} onClick={handleBookmark}>
              <BiSolidBookmarkStar />
            </button>

            <div className="add-board-container">
              <button
                onClick={() => setShowBoardDropdown(prev => !prev)}
                className="add-board-btn"
              >
                Add to Board
              </button>
              {showBoardDropdown && (
                <div className="add-board-dropdown">
                  {boards.length === 0 ? (
                    <p className="dropdown-item">No boards found</p>
                  ) : (
                    boards.map((b) => (
                      <div
                        key={b._id}
                        onClick={() => handleAddToBoard(b._id)}
                        className="dropdown-item"
                      >
                        {b.name}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {imageData.caption && <p className="image-description">{imageData.caption}</p>}
      </div>

      <div className="comments-section">
        <h3>Comments</h3>

        <div className="add-comment">
          <input
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button onClick={handleAddComment}>Post</button>
        </div>

        {comments.length === 0 && <p>No comments yet.</p>}
        {comments.map((c) => (
  <div key={c._id} className="comment">
    <div
      className="comment-avatar"
      onClick={() => {
        if (user && c.owner._id !== user._id) {
          navigate(`/user/${c.owner._id}`);
        }
      }}
      style={{ cursor: user && c.owner._id !== user._id ? "pointer" : "default" }}
    >
      {c.owner.avatar ? (
        <img src={c.owner.avatar} alt={c.owner.username} />
      ) : (
        <div className="placeholder-avatar">{c.owner.username[0]}</div>
      )}
    </div>

    <div className="comment-content">
      <strong>{c.owner.username}</strong>
      <span>{c.content}</span>
    </div>

    {user && c.owner._id === user._id && (
      <button
        className="comment-delete-btn"
        onClick={() => handleDeleteComment(c._id)}
      >
        ✕
      </button>
    )}
  </div>
))}
      </div>
    </div>
  );
};

export default ImageDetailPage;