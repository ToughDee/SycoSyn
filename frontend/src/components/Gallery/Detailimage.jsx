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
  const { boards } = useContext(BoardsContext);

  const [imageData, setImageData] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [showBoardDropdown, setShowBoardDropdown] = useState(false);

  // Fetch image + comments once
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

  // Add to board
  const handleAddToBoard = async (boardId) => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/board/add/${imageData._id}/${boardId}`, {
        method: "PATCH",
        credentials: "include",
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to add artwork to board");

      alert(`Artwork added to board!`);
      setShowBoardDropdown(false);
    } catch (err) {
      console.error(err);
      alert("Error adding artwork to board");
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!imageData) return <p>No image found</p>;

  return (
    <div className="image-detail-page">
      <div className="image-detail-header">
        <button onClick={() => navigate(-1)}>← Back</button>
      </div>

      <div className="image-section">
        <img src={imageData.content} alt={imageData.name} className="detail-image" />
        <div className="image-actions">
          <button className={isLiked ? "liked" : ""} onClick={handleLike}>
            <FaHeart /> {likesCount}
          </button>
          <button className={isBookmarked ? "bookmarked" : ""} onClick={handleBookmark}>
            <BiSolidBookmarkStar />
          </button>

          {/* Add to Board Dropdown */}
          <div className="add-board-container">
            <button
              onClick={() => setShowBoardDropdown((prev) => !prev)}
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
            <strong>{c.owner.username}:</strong> <span>{c.content}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageDetailPage;