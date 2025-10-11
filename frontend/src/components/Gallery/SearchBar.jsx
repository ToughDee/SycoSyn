import React, { useRef } from "react";
import "./Gallery.css";

const SearchBar = ({ onSearch }) => {
  const inputRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    const searchTerm = inputRef.current.value.trim();
   
      onSearch(searchTerm);
      

  };

  return (
    <form className="g1-search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        ref={inputRef}
        placeholder="Search artworks..."
      />
      <button type="submit">Search</button>
    </form>
  );
};

export default SearchBar;