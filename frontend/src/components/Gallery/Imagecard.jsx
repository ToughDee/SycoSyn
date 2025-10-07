import React, { useState, useContext } from "react";
import "./Gallery.css";
import { FaHeart } from "react-icons/fa";
import { BiSolidBookmarkStar } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { BookmarksContext } from "../../Store/BookmarksContext";

const ImageCard = ({ image }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(image.likes);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { bookmarks, dispatchBookmarks } = useContext(BookmarksContext);
  const navigate = useNavigate();

  const alreadyBookmarked = bookmarks.some((b) => b.id === image.id);

  const handleLike = () => {
    if (isLiked) {
      setLikesCount((prev) => prev - 1);
    } else {
      setLikesCount((prev) => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleBookmark = () => {
    if (alreadyBookmarked) {
      dispatchBookmarks({ type: "REMOVE_BOOKMARK", payload: image.id });
      setIsBookmarked(false);
    } else {
      const newBookmark = {
        id: image.id,
        title: image.tags.split(",")[0] || "Untitled",
        artist: image.user || "Unknown",
        image: image.webformatURL,
        likes: likesCount,
      };
      dispatchBookmarks({ type: "ADD_BOOKMARK", payload: newBookmark });
      setIsBookmarked(true);
    }
  };

  const handleUserClick = () => {
    // Navigate to user profile page with the userId
    navigate(`/user/${image.user_id}`);
  };

  return (
    <div className="g1-image-card">
      <div className="g1-image-wrapper">
        <img src={image.content} alt={image.name} />
      </div>

      <div className="g1-card-content">
        <div className="g1-artist-info" onClick={handleUserClick}>
          <div className="g1-artist-avatar">
            {image.owner.avatar ? (
              <img src={image.owner.avatar} alt={image.owner.username} />
            ) : (
              <span>{image.owner.username?.[0]}</span>
            )}
          </div>
          <span className="g1-artist-name">{image.owner.username}</span>
        </div>

       {/* <div className="g1-tags">
  {image.tags.slice(0, 5).map((tag, idx) => (
    <span key={idx} className="g1-tag">
      {tag}
    </span>
  ))}
</div> */}
        <div className="g1-card-actions">
          <button
            className={`g1-like-btn ${isLiked ? "liked" : ""}`}
            onClick={handleLike}
          >
            <FaHeart /> {likesCount}
          </button>
          <button
            className={`g1-bookmark-btn ${
              alreadyBookmarked || isBookmarked ? "bookmarked" : ""
            }`}
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