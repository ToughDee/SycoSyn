import React from "react";
import "./Gallery.css";

const categories = [
  "All",
  "Painting",
  
  "Digital",
  "Photography",
  "3D Art",
  "Writing",
  "Sketch",
  "Abstract",
  "Nature",
  
  "People",
  "Animals"
];

const CategoryFilter = ({ selectedCategory, onSelectCategory }) => {
  return (
   <div className="g1-category-filter">
  {categories.map((category) => (
    <button
      key={category}
      className={`g1-category-btn ${selectedCategory === category ? "active" : ""}`}
      onClick={() => onSelectCategory(category)}
    >
      {category}
    </button>
  ))}
</div>
  );
};

export default CategoryFilter;