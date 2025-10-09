import React, { createContext, useState } from "react";

export const BoardsContext = createContext();

export const BoardsProvider = ({ children }) => {
  const [boards, setBoards] = useState([
    {
      id: 1,
      title: "Dreamy Landscapes",
      description: "A collection of serene natural sceneries.",
      image: "/assets/images/a1.jpg",
      artworks:  [
      { id: 1, image: "/assets/images/a2.jpg", title: "Ethereal Waves", artist: "Luna Park" },
      { id: 2, image: "/assets/images/a3.jpg", title: "Digital Bloom", artist: "Kai Ito" },
      { id: 3, image: "/assets/images/img3.jpg", title: "Neon Dreams", artist: "Mira Sol" },
      { id: 4, image: "/assets/images/img7.jpg", title: "Fractured Skies", artist: "Noah Lin" },
      { id: 5, image: "/assets/images/img8.jpg", title: "Ocean Memory", artist: "Lara Chen" },
    ],
    },
    {
      id: 2,
      title: "Digital Abstracts",
      description: "Bold colors and futuristic compositions.",
      image: "/assets/images/a2.jpg",
      artworks: [],
    },
    {
      id: 3,
      title: "Portrait Inspirations",
      description: "Faces, moods, and stories told in brushstrokes.",
      image: "/assets/images/a3.jpg",
      artworks: [],
    },
    {
      id: 4,
      title: "Minimal Aesthetics",
      description: "Less is more — clean, simple, elegant.",
      image: "/assets/images/art1.jpg",
      artworks: [],
    },
  ]);

  const updateBoard = (updatedBoard) => {
    setBoards((prev) =>
      prev.map((b) => (b.id === updatedBoard.id ? updatedBoard : b))
    );
  };

  return (
    <BoardsContext.Provider value={{ boards, updateBoard }}>
      {children}
    </BoardsContext.Provider>
  );
};