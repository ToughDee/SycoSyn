import React, { useRef } from "react";
import "./Gallery.css";
import { FaUpload } from "react-icons/fa";

const SearchBar = ({ onSearch, onUpload }) => {
  const inputRef = useRef();
  const fileInputRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    const searchTerm = inputRef.current.value.trim();
    if (searchTerm !== "") {
      onSearch(searchTerm);
      inputRef.current.value = "";
    }
  };

  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpload(reader.result); 
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form className="g1-search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        ref={inputRef}
        placeholder="Search artworks..."
      />
      <button type="submit">Search</button>

      {/* Upload Button */}
      <button
        type="button"
        className="g1-upload-icon-btn"
        onClick={handleFileClick}
      >
        <FaUpload />
      </button>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </form>
  );
};

export default SearchBar;