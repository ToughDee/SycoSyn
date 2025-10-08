import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UploadsContext } from "../../Store/UploadsContext";
import "./UploadsSection.css";

const UploadsSection = () => {
  const { uploads, deleteUpload } = useContext(UploadsContext); // use deleteUpload from context
  const navigate = useNavigate();
  const [deletingId, setDeletingId] = useState(null); // optional: show deleting feedback

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this artwork?")) return;

    try {
      setDeletingId(id); // show deleting state
      await deleteUpload(id); // call context function
    } finally {
      setDeletingId(null); // reset deleting state
    }
  };

  return (
    <div className="uploads-section">
      <h2>My Uploads</h2>

      {uploads.length === 0 ? (
        <div className="no-uploads">
          <h1>No uploads</h1>
          <p>Upload your first artwork!</p>
          <button
            className="upload-first-btn"
            onClick={() => navigate("/upload-artworks")}
          >
            Upload Now
          </button>
        </div>
      ) : (
        <div className="uploads-scroll">
          {uploads.map((upload) => (
            <div key={upload.id} className="upload-card">
              <div className="image-wrapper">
                <img src={upload.image} alt={upload.title} />
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(upload.id)}
                  disabled={deletingId === upload.id} // disable while deleting
                >
                  {deletingId === upload.id ? "Deleting..." : "🗑 Delete"}
                </button>
              </div>
              <div className="upload-content">
                <h3>{upload.title}</h3>
                <p>
                  Uploaded on {new Date(upload.uploadDate).toLocaleDateString()}
                </p>
                <div className="upload-stats">
                  <span>❤️ {upload.likes || 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UploadsSection;