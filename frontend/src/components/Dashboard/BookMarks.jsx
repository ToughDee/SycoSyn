import React, { useContext } from "react";
import { BookmarksContext } from "../../Store/BookmarksContext";
import "./BookmarksSection.css";

const BookmarksSection = () => {
  const { bookmarks, dispatchBookmarks } = useContext(BookmarksContext);

  const handleRemove = async (id) => {
    try {
      // 🔹 Send DELETE request to backend
      const response = await fetch(`http://localhost:8000/api/v1/bookmark/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        console.error("Failed to remove bookmark from backend");
        return;
      }

   
      dispatchBookmarks({ type: "REMOVE_BOOKMARK", payload: id });
    } catch (error) {
      console.error("Error removing bookmark:", error);
    }
  };

  return (
    <div className="bookmarks-section">
      <h2 className="section-title">My Bookmarks</h2>

      {bookmarks.length === 0 ? (
        <div className="no-bookmarks">
          <h1>No bookmarks</h1>
          <p>No bookmarks yet! Your saved artworks will appear here.</p>
        </div>
      ) : (
        <div className="bookmarks-scroll">
          {bookmarks.map((bookmark) => (
            <div key={bookmark.id} className="bookmark-card">
              <div className="bookmark-image-wrapper">
                <img
                  src={bookmark.image}
                  alt={bookmark.title}
                  className="bookmark-image"
                />
                <button
                  className="remove-btn1"
                  onClick={() => handleRemove(bookmark.id)}
                >
                  Remove
                </button>
              </div>
              <div className="bookmark-content">
                <h3 className="bookmark-title">{bookmark.title}</h3>
                <p className="bookmark-artist">
                  by {bookmark.artist || "Unknown"}
                </p>
                <div className="bookmark-stats">
                  <span>❤️ {bookmark.likes || 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookmarksSection;