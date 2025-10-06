import React, { useState, useContext } from "react";
import "./Gallery.css";
import { FaHeart } from "react-icons/fa";
import { BiSolidBookmarkStar } from "react-icons/bi";
import { BookmarksContext } from "../../Store/BookmarksContext";

const ImageCard = ({ image }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(image.likes || 0);
  const { bookmarks, dispatchBookmarks } = useContext(BookmarksContext);

  const alreadyBookmarked = bookmarks.some((b) => b.id === image._id);

  const handleLike = () => {
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    setIsLiked(!isLiked);
  };

  const handleBookmark = () => {
    if (alreadyBookmarked) {
      dispatchBookmarks({ type: "REMOVE_BOOKMARK", payload: image._id });
    } else {
      const newBookmark = {
        id: image._id,
        title: image.name,
        artist: image.owner?.username || "Unknown",
        image: image.content,
        likes: likesCount,
      };
      dispatchBookmarks({ type: "ADD_BOOKMARK", payload: newBookmark });
    }
  };

  return (
    <div className="g1-image-card">
      <div className="g1-image-wrapper">
        <img src={image.content} alt={image.name} />
      </div>

      <div className="g1-card-content">
        <div className="g1-artist-info">
          <div className="g1-artist-avatar">
            {image.owner?.avatar ? (
              <img src={image.owner.avatar} alt={image.owner.username} />
            ) : (
              <span>{image.owner?.username?.[0]}</span>
            )}
          </div>
          <span className="g1-artist-name">{image.owner?.username}</span>
        </div>

        <div className="g1-tags">
          {image.tags?.slice(0, 4).map((tag, idx) => (
            <span key={idx} className="g1-tag">{tag}</span>
          ))}
        </div>

        <div className="g1-card-actions">
          <button
            className={`g1-like-btn ${isLiked ? "liked" : ""}`}
            onClick={handleLike}
          >
            <FaHeart /> {likesCount}
          </button>
          <button
            className={`g1-bookmark-btn ${alreadyBookmarked ? "bookmarked" : ""}`}
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
