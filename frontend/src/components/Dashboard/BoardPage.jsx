import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BoardsContext } from "../../Store/BoardContext";
import "./BoardPage.css";

const BoardPage1 = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { refreshBoards } = useContext(BoardsContext);

  const [board, setBoard] = useState(null);
  const [editedBoard, setEditedBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // ✅ Popup state
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [pendingDeleteArtId, setPendingDeleteArtId] = useState(null);

  // 🔹 Fetch board
  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/v1/board/${id}`, {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) {
          setBoard(data.data);
          setEditedBoard({ ...data.data });
        }
      } catch (err) {
        console.error("Error fetching board:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBoard();
  }, [id]);

  const startEdit = () => setEditMode(true);
  const cancelEdit = () => {
    setEditedBoard({ ...board });
    setEditMode(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditedBoard((prev) => ({
        ...prev,
        newCoverImage: file,
        coverImagePreview: URL.createObjectURL(file),
      }));
    }
  };

  // 🔹 Save board with popup
  const saveBoard = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", editedBoard.name);
      formData.append("description", editedBoard.description);
      if (editedBoard.newCoverImage) {
        formData.append("coverImage", editedBoard.newCoverImage);
      }

      const res = await fetch(`http://localhost:8000/api/v1/board/${id}`, {
        method: "PATCH",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setBoard((prev) => ({
          ...prev,
          ...data.data,
          arts: prev.arts,
        }));
        setEditMode(false);
        await refreshBoards();

        setPopupMessage("Board updated successfully!");
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 2000);
      } else {
        setPopupMessage("Failed to update board");
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 2000);
      }
    } catch (err) {
      console.error("Error updating board:", err);
      setPopupMessage("Error updating board");
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  // 🔹 Delete artwork with popup confirmation
  const deleteArtwork = (artId) => {
    setPopupMessage("Delete this artwork from board?");
    setShowPopup(true);
    setPendingDeleteArtId(artId);
  };

  const handleConfirmDeleteArtwork = async () => {
    const artId = pendingDeleteArtId;
    if (!artId) return;

    setShowPopup(false);
    setPendingDeleteArtId(null);

    try {
      const res = await fetch(
        `http://localhost:8000/api/v1/board/remove/${artId}/${id}`,
        { method: "PATCH", credentials: "include" }
      );
      const data = await res.json();
      if (data.success) {
        setBoard((prev) => ({
          ...prev,
          arts: prev.arts.filter((art) => art._id !== artId),
        }));
        await refreshBoards();

        setPopupMessage("Artwork deleted successfully!");
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 2000);
      } else {
        setPopupMessage("Failed to delete artwork");
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 2000);
      }
    } catch (err) {
      console.error("Error deleting artwork:", err);
      setPopupMessage("Error deleting artwork");
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2000);
    }
  };

  if (loading) return <p>Loading board...</p>;
  if (!board) return <p>Board not found!</p>;

  return (
    <div className="board-page1">
      {/* Popup */}
      {showPopup && (
        <div className="board-popup">
          <p>{popupMessage}</p>
          {pendingDeleteArtId && (
            <div className="popup-buttons">
              <button onClick={handleConfirmDeleteArtwork}>Yes</button>
              <button
                onClick={() => {
                  setShowPopup(false);
                  setPendingDeleteArtId(null);
                }}
              >
                No
              </button>
            </div>
          )}
        </div>
      )}

      {/* Header */}
      <header className="board-header1">
        <button className="back-btn1" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1 className="board-page-title1">{board.name}</h1>
      </header>

      <div className="board-content1">
        {/* Left Panel */}
        <div className="board-info1">
          <img
            src={
              editedBoard?.coverImagePreview ||
              editedBoard?.coverImage ||
              board.arts?.[0]?.content ||
              "/assets/images/default-board.jpg"
            }
            alt={board.name}
            className="board-cover1"
          />
          <div className="board-details1">
            {editMode ? (
              <>
                <input
                  type="text"
                  value={editedBoard.name}
                  onChange={(e) =>
                    setEditedBoard({ ...editedBoard, name: e.target.value })
                  }
                  className="edit-input1"
                />
                <textarea
                  value={editedBoard.description}
                  onChange={(e) =>
                    setEditedBoard({ ...editedBoard, description: e.target.value })
                  }
                  className="edit-textarea1"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="edit-file1"
                />
                <div className="edit-buttons1">
                  <button className="save-btn1" onClick={saveBoard} disabled={saving}>
                    {saving ? "Saving..." : "Save"}
                  </button>
                  <button className="cancel-btn1" onClick={cancelEdit} disabled={saving}>
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2>{board.name}</h2>
                <p>{board.description}</p>
                <button className="edit-btn1" onClick={startEdit}>
                  Edit Board
                </button>
              </>
            )}
          </div>
        </div>

        {/* Right Panel */}
        <div className="board-artworks1">
          <h3 className="artworks-title1">Artworks in this board</h3>
          <div className="artworks-scroll1">
            {board.arts?.length > 0 ? (
              board.arts.map((art) => (
                <div key={art._id} className="art-card1" style={{ position: "relative" }}>
                  <img src={art.content} alt={art.name} className="art-image1" />
                  {editMode && (
                    <button
                      className="delete-art-btn1"
                      onClick={() => deleteArtwork(art._id)}
                      disabled={saving}
                    >
                      ✕
                    </button>
                  )}
                  <div className="art-info1">
                    <h4>{art.name}</h4>
                    <p>by {art.owner?.username}</p>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ textAlign: "center", marginTop: "20px", color: "#555" }}>
                No artworks added
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardPage1;