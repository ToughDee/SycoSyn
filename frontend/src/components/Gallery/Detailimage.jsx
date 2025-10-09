import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BookmarksContext } from "../../Store/BookmarksContext";
import { FaHeart } from "react-icons/fa";
import { BiSolidBookmarkStar } from "react-icons/bi";

import "./Gallery.css";

const ImageDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { bookmarks, dispatchBookmarks } = useContext(BookmarksContext);

  const [imageData, setImageData] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState("");

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
        setImageData(imageJson.data);
        setIsLiked(imageJson.data.likedByUser || false);
        setLikesCount(imageJson.data.likes || 0);
        setIsBookmarked(bookmarks.some((b) => b.id === imageJson.data._id));

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

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const res = await fetch(`http://localhost:8000/api/v1/comments/${id}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
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
        </div>
      </div>

      <div className="comments-section">
        <h3>Comments</h3>

        {/* Add comment input */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
          <input
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
          />
          <button
            onClick={handleAddComment}
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              backgroundColor: "#4f46e5",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Post
          </button>
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