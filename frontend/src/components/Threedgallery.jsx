import { useState } from "react";

import "../Rgallery.css"

const Rotating3DGallery = () => {
  const [hovered, setHovered] = useState(null);

  const artworks = [
    { id: 1, image: "/assets/images/a1.jpg", title: "Abstract Geometry", artist: "Sarah Chen", category: "Digital Art" },
    { id: 2, image: "/assets/images/a2.jpg", title: "Dreamy Landscape", artist: "Marcus Cole", category: "Watercolor" },
    { id: 3, image: "/assets/images/a3.jpg", title: "Creative Workspace", artist: "Luna Park", category: "Illustration" },
  ];

  return (
    <section className="gallery-section">
      <h2>Featured Gallery</h2>
      <p>Hover to flip the artwork</p>

      <div className="gallery-grid">
        {artworks.map((art, i) => (
          <div
            key={art.id}
            className="art-card"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <div className={`art-inner ${hovered === i ? "flipped" : ""}`}>
              {/* Front */}
              <div className="art-front">
                <img src={art.image} alt={art.title} />
                <div className="art-info">
                  <span className="category">{art.category}</span>
                  <h3>{art.title}</h3>
                  <p>{art.artist}</p>
                </div>
              </div>
              {/* Back */}
              <div className="art-back">
                <h3>{art.title}</h3>
                <p>by {art.artist}</p>
                <button>View Artwork</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Rotating3DGallery;