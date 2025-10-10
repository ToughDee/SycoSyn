// src/components/Boards/BoardsSection.jsx
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { BoardsContext } from "../../Store/BoardContext";
import "./Boards.css";

const BoardsSection = () => {
  const navigate = useNavigate();
  const { boards } = useContext(BoardsContext);

  return (
    <div className="boards-section">
      <h2 className="section-title">My Boards</h2>

      {boards.length === 0 ? (
        <div className="no-boards">
          <img src="/assets/images/empty-folder.png" alt="No Boards" />
          <h1>No Boards</h1>
          <p>You haven’t created any boards yet.</p>
          <button onClick={() => navigate("/create-board")}>
            + Create Your First Board
          </button>
        </div>
      ) : (
        <div className="boards-scroll">
          {boards.map((board) => (
            <div key={board._id} className="board-card">
              <div className="board-image-wrapper">
                <img
                  src={board.arts?.[0]?.content || "/assets/images/default-board.jpg"}
                  alt={board.name}
                  className="board-image"
                />
              </div>
              <div className="board-content">
                <h3 className="board-title">{board.name}</h3>
                <p className="board-description">{board.description}</p>
                <button
                  className="view-btn"
                  onClick={() => navigate(`/boards/${board._id}`)}
                >
                  View Board
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BoardsSection;