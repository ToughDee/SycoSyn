import React, { useState, useContext, useEffect } from "react";
import "./Gallery.css";
import { FaHeart } from "react-icons/fa";
import { BiSolidBookmarkStar } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { BookmarksContext } from "../../Store/BookmarksContext";

const ImageCard = ({ image }) => {
  const { bookmarks, dispatchBookmarks } = useContext(BookmarksContext);
  const navigate = useNavigate();

  // ✅ Initialize bookmark state based on BookmarksContext
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    setIsBookmarked(bookmarks.some((b) => b.id === image._id));
  }, [bookmarks, image._id]);

  // Likes state
  const [isLiked, setIsLiked] = useState(image.likedByUser || false);
  const [likesCount, setLikesCount] = useState(image.likes || 0);

  // 🔹 Like handler
  const handleLike = async () => {
    const newLikedState = !isLiked;
    const newLikesCount = newLikedState ? likesCount + 1 : likesCount - 1;

    // Optimistic UI update
    setIsLiked(newLikedState);
    setLikesCount(newLikesCount);

    try {
      const response = await fetch(`http://localhost:8000/api/v1/like/toggle/a/${image._id}`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        // Rollback on failure
        setIsLiked(!newLikedState);
        setLikesCount(likesCount);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      setIsLiked(!newLikedState);
      setLikesCount(likesCount);
    }
  };

  // 🔹 Bookmark handler
  const handleBookmark = async () => {
    const newBookmarkState = !isBookmarked;

    // Optimistic update
    setIsBookmarked(newBookmarkState);

    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/art/bookmark/toggle/${image._id}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!response.ok) {
        setIsBookmarked(!newBookmarkState);
        return;
      }

      // Update BookmarksContext
      if (newBookmarkState) {
        const newBookmark = {
          id: image._id,
          title: image.name || "Untitled",
          artist: image.owner?.username || "Unknown",
          image: image.content,
          likes: likesCount,
        };
        dispatchBookmarks({ type: "ADD_BOOKMARK", payload: newBookmark });
      } else {
        dispatchBookmarks({ type: "REMOVE_BOOKMARK", payload: image._id });
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      setIsBookmarked(!newBookmarkState);
    }
  };

  // 🔹 Navigate to user profile
  const handleUserClick = () => {
    navigate(`/user/${image.owner?._id || image.user_id}`);
  };

  return (
    <div className="g1-image-card">
      <div className="g1-image-wrapper">
        <img src={image.content} alt={image.name} />
      </div>

      <div className="g1-card-content">
        <div className="g1-artist-info" onClick={handleUserClick}>
          <div className="g1-artist-avatar">
            {image.owner?.avatar ? (
              <img src={image.owner.avatar} alt={image.owner.username} />
            ) : (
              <span>{image.owner?.username?.[0]}</span>
            )}
          </div>
          <span className="g1-artist-name">{image.owner?.username}</span>
        </div>

        <div className="g1-card-actions">
          <button
            className={`g1-like-btn ${isLiked ? "liked" : ""}`}
            onClick={handleLike}
          >
            <FaHeart /> {likesCount}
          </button>

          <button
            className={`g1-bookmark-btn ${isBookmarked ? "bookmarked" : ""}`}
            onClick={handleBookmark}
          >
            <BiSolidBookmarkStar />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;