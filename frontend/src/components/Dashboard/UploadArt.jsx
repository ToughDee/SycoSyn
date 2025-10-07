import React, { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UploadsContext } from "../../Store/UploadsContext";
import "./uploadart.css";

function UploadArtForm() {
  const { dispatchUploads } = useContext(UploadsContext);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // ✅ Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // ✅ Remove selected file
  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl("");
  };

  // ✅ Submit form and post to backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile || !title) {
      alert("Please provide a title and select an image.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", title);
      formData.append("caption", description);
      formData.append("artFile", selectedFile);

      const res = await fetch("http://localhost:8000/api/v1/art/", {
        method: "POST",
        body: formData,
        credentials:"include",
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();

      // Dispatch new upload to context
      const newUpload = {
        id: data._id,
        title: data.name,
        description: data.caption,
        image: data.content,
        likes: data.likes || 0,
        uploadDate: data.createdAt,
      };

      dispatchUploads({ type: "ADD_UPLOAD", payload: newUpload });

      alert("Upload Successful!");

      // Reset form
      setSelectedFile(null);
      setPreviewUrl("");
      setTitle("");
      setDescription("");

      // Navigate
      navigate("/user-profile");
    } catch (err) {
      console.error(err);
      alert("Failed to upload artwork. Try again.");
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    setTitle("");
    setDescription("");
  };

  return (
    <div className="upload-form-container">
      <h2>Upload New Artwork</h2>
      <form onSubmit={handleSubmit} className="upload-form">
        <div className="form-group">
          <label>Artwork Image *</label>
          {!previewUrl ? (
            <div
              className="file-input-wrapper"
              onClick={() => fileInputRef.current.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <p className="upload-text">Click to upload or drag and drop</p>
              <p className="upload-sub">PNG, JPG, GIF up to 10MB</p>
            </div>
          ) : (
            <div className="image-preview">
              <img src={previewUrl} alt="Preview" />
              <button
                type="button"
                className="remove-btn"
                onClick={handleRemoveFile}
              >
                ✕
              </button>
              <div className="file-name">{selectedFile?.name}</div>
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter artwork title"
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Tell us about your artwork..."
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-upload">
            Upload Artwork
          </button>
          <button type="button" className="btn btn-clear" onClick={handleClear}>
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}

export default UploadArtForm;