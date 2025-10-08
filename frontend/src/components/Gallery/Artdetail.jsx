import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Gallery.css";
import { FaHeart, FaEye } from "react-icons/fa";

const ArtDetail = () => {
  const { id } = useParams();
  const [art, setArt] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchArt = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/art/${id}`, {
        credentials: "include",
      });
      const data = await response.json();
      setArt(data?.data?.art);
    } catch (error) {
      console.error("Error fetching art details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArt();
  }, [id]);

  if (loading) return <div className="ad-loading">Loading...</div>;
  if (!art) return <div className="ad-not-found">Art not found</div>;

  return (
    <div className="ad-container">
      <div className="ad-image-section">
        <img src={art.content} alt={art.name} className="ad-full-image" />
      </div>

      <div className="ad-info-section">
        <h2>{art.name}</h2>
        <div className="ad-meta">
          <span className="ad-artist">By {art.owner.username}</span>
          <span className="ad-stats">
            <FaHeart /> {art.likes} &nbsp; <FaEye /> {art.views}
          </span>
        </div>

        <p className="ad-description">{art.description}</p>

        {/* ✅ Comments section */}
        <div className="ad-comments">
          <h3>Comments</h3>
          {art.comments && art.comments.length > 0 ? (
            <ul>
              {art.comments.map((c, i) => (
                <li key={i}>
                  <strong>{c.user?.username || "Anonymous"}:</strong> {c.text}
                </li>
              ))}
            </ul>
          ) : (
            <p>No comments yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtDetail;