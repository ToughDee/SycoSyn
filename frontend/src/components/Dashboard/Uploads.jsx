import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UploadsContext } from "../../Store/UploadsContext";
import "./UploadsSection.css";

const UploadsSection = () => {
  const { uploads, dispatchUploads } = useContext(UploadsContext);
  const navigate = useNavigate();

  const handleDelete = (id) => {
    dispatchUploads({ type: "DELETE_UPLOAD", payload: id });
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
                >
                  🗑 Delete
                </button>
              </div>
              <div className="upload-content">
                <h3>{upload.title}</h3>
                <p>
                  Uploaded on{" "}
                  {new Date(upload.uploadDate).toLocaleDateString()}
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