import React, { useEffect, useState } from "react";
import TopBar from "./TopBar";
import SearchBar from "./SearchBar";
import CategoryFilter from "./CategoryFilter";
import ImageCard from "./Imagecard";
import "./Gallery.css";

function Gallery() {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("art");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const fetchArts = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: 1,
        limit: 30,
        query: searchTerm,
        category: selectedCategory === "All" ? "" : selectedCategory
      });

      const response = await fetch(`http://localhost:8000/api/v1/art?${params.toString()}`, {credentials: "include"});
      const data = await response.json();

      setImages(data?.data?.arts || []);
    } catch (error) {
      console.error("Error fetching arts:", error);
      setImages([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArts();
  }, [searchTerm, selectedCategory]);

  const handleSearch = (term) => {
    setSearchTerm(term || "art");
    setSelectedCategory("All");
  };

  return (
    <div className="g1-gallery-page">
      <TopBar />
      <div className="g1-gallery-main">
        <SearchBar onSearch={handleSearch} />
        <CategoryFilter selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
        {isLoading ? (
          <div className="g1-loading">Loading...</div>
        ) : images.length === 0 ? (
          <div className="g1-no-images">No images found</div>
        ) : (
          <div className="g1-image-grid">
            {images.map((image) => <ImageCard key={image._id} image={image} />)}
          </div>
        )}
      </div>
    </div>
  );
}

export default Gallery;