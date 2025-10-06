import React, { useState } from 'react';

const Card = ({ image }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false); 
  const [isBookmarked, setIsBookmarked] = useState(false); // 👈 bookmark state

  const handleLikeClick = (e) => {
    e.stopPropagation(); // prevent card click from triggering zoom
    setIsLiked(!isLiked);
  };

  const handleBookmarkClick = (e) => {
    e.stopPropagation(); // prevent card click from triggering zoom
    setIsBookmarked(!isBookmarked);
  };

  const handleCardClick = () => {
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
  };

  return (
    <div
      className="card"
      onClick={handleCardClick}
      onMouseLeave={handleMouseLeave}
    >

      <div className={`image-wrapper ${isZoomed ? 'zoomed' : ''}`}>
        <img src={image.webformatURL} alt={image.tags} />
      </div>

      <div className="content">
        <div className="artist">Artist: {image.user}</div>

        <div style={{ display: 'flex', gap: '1rem' }}>
        
          <button
            className={`like-btn ${isLiked ? 'liked' : ''}`}
            onClick={handleLikeClick}
            aria-label="Like button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill={isLiked ? 'currentColor' : 'none'}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span className="like-text">
              {isLiked ? image.likes + 1 : image.likes} Likes
            </span>
          </button>

          {/* Bookmark Button */}
          <button
            className={`bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
            onClick={handleBookmarkClick}
            aria-label="Bookmark button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill={isBookmarked ? 'black' : 'none'}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 5v16l7-5 7 5V5a2 2 0 00-2-2H7a2 2 0 00-2 2z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;