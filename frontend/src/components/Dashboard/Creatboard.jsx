// src/components/Boards/CreateBoard.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { BoardsContext } from "../../Store/BoardContext";
import "./CreateBoard.css";

const CreateBoard = () => {
  const navigate = useNavigate();
  const { createBoard } = useContext(BoardsContext); // ✅ use context
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateBoard = async () => {
    if (!name.trim()) return alert("Board name is required");

    setLoading(true);
    try {
      const newBoard = await createBoard(name, description); // ✅ context function
      if (newBoard) {
        alert("Board created successfully!");
        navigate("/user-profile"); // redirect after creation
      } else {

        alert("Failed to create board");
      }
    } catch (err) {
      console.error("Error creating board:", err);
      alert("Error creating board");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-board-page">
      <h2>Create New Board</h2>
      <input
        type="text"
        placeholder="Board Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <textarea
        placeholder="Board Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button onClick={handleCreateBoard} disabled={loading}>
        {loading ? "Creating..." : "Create Board"}
      </button>
      <button onClick={() => navigate(-1)}>Cancel</button>
    </div>
  );
};

export default CreateBoard;