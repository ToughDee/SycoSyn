import React from "react";
import { useNavigate } from "react-router-dom";
import "./Boards.css";
import { useContext } from "react";
import { BoardsContext } from "../../Store/BoardContext";

const BoardsSection = () => {
  const navigate = useNavigate();

  // Temporary sample data
  const { boards } = useContext(BoardsContext);

  return (
    <div className="boards-section">
      <h2 className="section-title">My Boards</h2>

      {boards.length === 0 ? (
        <div className="no-boards">
          <h1>No Boards</h1>
          <p>You haven’t created any boards yet.</p>
        </div>
      ) : (
        <div className="boards-scroll">
          {boards.map((board) => (
            <div key={board.id} className="board-card">
              <div className="board-image-wrapper">
                <img
                  src={board.image}
                  alt={board.title}
                  className="board-image"
                />
              </div>
              <div className="board-content">
                <h3 className="board-title">{board.title}</h3>
                <p className="board-description">{board.description}</p>
                <button
                  className="view-btn"
                  onClick={() => navigate(`/boards/${board.id}`)}
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