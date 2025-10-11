import React, { useContext, useEffect, useState } from "react";
import TopBar from "./TopBar";
import SearchBar from "./SearchBar";
import CategoryFilter from "./CategoryFilter";
import ImageCard from "./Imagecard";
import "./Gallery.css";
import { BoardsContext } from "../../Store/BoardContext";

function Gallery() {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");


  const { user, refreshBoards } = useContext(BoardsContext);

  // ✅ Refresh boards only after user is loaded
  useEffect(() => {
    if (user) {
      refreshBoards();
    }
  }, [user, refreshBoards]);
  
 const fetchArts = async () => {
  setIsLoading(true);
  try {
    // Always include query and category
    const params = new URLSearchParams({
      page: 1,
      limit: 60,
      query: searchTerm, // can be empty string
      category: selectedCategory === "All" ? "" : selectedCategory,
    });

    const response = await fetch(`http://localhost:8000/api/v1/art?${params.toString()}`, {
      credentials: "include",
    });
    const data = await response.json();

    const shuffled = data.data?.arts?.sort(() => Math.random() - 0.5) || [];
    setImages(shuffled);
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
    setSearchTerm(term || "");
    // setSelectedCategory(Se);
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