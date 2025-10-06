import React, { useContext } from "react";
import { UploadsContext } from "../../Store/UploadsContext";
import "./UploadsSection.css";

const UploadsSection = () => {
  const { uploads, dispatchUploads } = useContext(UploadsContext);

  const handleDelete = (id) => {
    dispatchUploads({ type: "DELETE_UPLOAD", payload: id });
  };

  return (
    <div className="uploads-section">
      <h2>My Uploads</h2>
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
                Uploaded on {new Date(upload.uploadDate).toLocaleDateString()}
              </p>
              <div className="upload-stats">
                <span>❤️ {upload.likes || 0}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadsSection;