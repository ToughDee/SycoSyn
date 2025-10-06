import React, { useRef } from 'react';


const ImageSearch = ({ onSearch }) => {
  const inputRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    const term = inputRef.current.value.trim();
    if (term) {
      onSearch(term);
      inputRef.current.value = '';
    }
  };

  return (
    <div className="search-box">
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search Image Term..."
        />
        <button type="submit">Search</button>
      </form>
    </div>
  );
};

export default ImageSearch;