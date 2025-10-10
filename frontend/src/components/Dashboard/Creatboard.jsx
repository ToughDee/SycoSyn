// src/components/Boards/CreateBoard.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { BoardsContext } from "../../Store/BoardContext";
import "./CreateBoard.css";

const CreateBoard = () => {
  const navigate = useNavigate();
  const { createBoard } = useContext(BoardsContext);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const handleCreateBoard = async () => {
    if (!name.trim()) {
      setPopupMessage("Board name is required");
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2000);
      return;
    }

    setLoading(true);
    try {
      const newBoard = await createBoard(name, description);
      if (newBoard) {
        setPopupMessage("Board created successfully!");
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          navigate("/user-profile"); // redirect after popup disappears
        }, 2000);
      } else {
        setPopupMessage("Failed to create board");
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 2000);
      }
    } catch (err) {
      console.error("Error creating board:", err);
      setPopupMessage("Error creating board");
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
     <button className="btn-back-board1" onClick={() => navigate(-1)}>
      ← Back
    </button>

    <div className="create-board-page">
     

      {showPopup && (
        <div className="board-success-popup">
          <p>{popupMessage}</p>
        </div>
      )}

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

      </>
  );

};

export default CreateBoard;