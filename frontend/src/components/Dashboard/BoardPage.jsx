import React, { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./BoardPage.css";
import { BoardsContext } from "../../Store/BoardContext";

const BoardPage1 = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { boards, updateBoard } = useContext(BoardsContext);

  // 🔹 Find the board from context
  const boardFromContext = boards.find(b => b.id === Number(id));

  const [board, setBoard] = useState(boardFromContext);
  const [editedBoard, setEditedBoard] = useState({ ...boardFromContext });
  const [editMode, setEditMode] = useState(false);

  // 🔹 Sync local state if context changes
  useEffect(() => {
    setBoard(boardFromContext);
    setEditedBoard({ ...boardFromContext });
  }, [boardFromContext]);

  // 🔹 Enter edit mode
  const startEdit = () => setEditMode(true);

  // 🔹 Save edits and update context
  const saveBoard = () => {
    setBoard({ ...editedBoard });
    updateBoard(editedBoard);
    setEditMode(false);
  };

  // 🔹 Cancel edits
  const cancelEdit = () => {
    setEditedBoard({ ...board });
    setEditMode(false);
  };

  // 🔹 Handle board field changes
  const handleChange = (field, value) =>
    setEditedBoard({ ...editedBoard, [field]: value });

  // 🔹 Delete artwork in edit mode
  const handleDeleteArtwork = (artId) => {
    if (!editMode) return;
    setEditedBoard({
      ...editedBoard,
      artworks: editedBoard.artworks.filter((a) => a.id !== artId),
    });
  };

  // 🔹 Handle cover image change
  const handleCoverChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const imageUrl = URL.createObjectURL(e.target.files[0]);
      handleChange("coverImage", imageUrl);
    }
  };

  // 🔹 Add Collaborator placeholder
  const handleAddCollaborator = () => {
    alert("Add Collaborator clicked!"); // Replace with real logic later
  };

  if (!board) return <p>Board not found!</p>;

  return (
    <div className="board-page1">
      {/* Header */}
      <header className="board-header1">
        <button className="back-btn1" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1 className="board-page-title1">{board.title}</h1>
        <button className="collab-btn1" onClick={handleAddCollaborator}>
          + Add Collaborators
        </button>
      </header>

      <div className="board-content1">
        {/* Left side - Board info */}
        <div className="board-info1">
          <img
            src={editMode ? editedBoard.coverImage : board.coverImage}
            alt={board.title}
            className="board-cover1"
          />
          {editMode && (
            <label className="cover-upload-label1">
              Change Cover Image:
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverChange}
                className="cover-upload-input1"
              />
            </label>
          )}
          <div className="board-details1">
            {editMode ? (
              <>
                <input
                  type="text"
                  value={editedBoard.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  className="edit-input1"
                  placeholder="Board Title"
                />
                <textarea
                  value={editedBoard.description}
                  onChange={(e) =>
                    handleChange("description", e.target.value)
                  }
                  className="edit-textarea1"
                  placeholder="Board Description"
                />
                <div className="edit-buttons1">
                  <button className="save-btn1" onClick={saveBoard}>
                    Save
                  </button>
                  <button className="cancel-btn1" onClick={cancelEdit}>
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2>{board.title}</h2>
                <p>{board.description}</p>
                <button className="edit-btn1" onClick={startEdit}>
                  Edit Board
                </button>
              </>
            )}
          </div>
        </div>

        {/* Right side - Artworks list */}
        <div className="board-artworks1">
          <h3 className="artworks-title1">Artworks in this board</h3>
          <div className="artworks-scroll1">
            {(editMode ? editedBoard.artworks : board.artworks).map((art) => (
              <div key={art.id} className="art-card1">
                <img src={art.image} alt={art.title} className="art-image1" />
                <div className="art-info1">
                  <h4>{art.title}</h4>
                  <p>by {art.artist}</p>
                </div>
                {editMode && (
                  <button
                    className="delete-art-btn1"
                    onClick={() => handleDeleteArtwork(art.id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardPage1;