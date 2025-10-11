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

  const [showCollabInput, setShowCollabInput] = useState(false);
  const [collabUsername, setCollabUsername] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  // new confirmation popup states
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(() => {});

  // Fetch board by ID
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
    } finally {
      setSaving(false);
    }
  };

  // 🔴 Updated delete board with popup
  const deleteBoard = async () => {
    setConfirmMessage("Are you sure you want to delete this board?");
    setConfirmAction(() => async () => {
      setShowConfirmPopup(false);
      try {
        const res = await fetch(`http://localhost:8000/api/v1/board/${id}`, {
          method: "DELETE",
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) {
          await refreshBoards();
          setPopupMessage("Board deleted successfully!");
          setShowPopup(true);
          setTimeout(() => {
            setShowPopup(false);
            navigate("/user-profile");
          }, 1500);
        } else {
          setPopupMessage("Failed to delete board");
          setShowPopup(true);
          setTimeout(() => setShowPopup(false), 2000);
        }
      } catch (err) {
        console.error("Error deleting board:", err);
      }
    });
    setShowConfirmPopup(true);
  };

  // 🔴 Updated delete artwork with popup
  const deleteArtwork = async (artId) => {
    setConfirmMessage("Delete this artwork from the board?");
    setConfirmAction(() => async () => {
      setShowConfirmPopup(false);
      try {
        const res = await fetch(`http://localhost:8000/api/v1/board/remove/${artId}/${id}`, {
          method: "PATCH",
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) {
          setBoard((prev) => ({
            ...prev,
            arts: prev.arts.filter((art) => art._id !== artId),
          }));
          await refreshBoards();
          setPopupMessage("Artwork removed successfully!");
          setShowPopup(true);
          setTimeout(() => setShowPopup(false), 1500);
        } else {
          setPopupMessage("Failed to delete artwork");
          setShowPopup(true);
          setTimeout(() => setShowPopup(false), 2000);
        }
      } catch (err) {
        console.error("Error deleting artwork:", err);
      }
    });
    setShowConfirmPopup(true);
  };

  const addCollaborator = async () => {
    if (!collabUsername.trim()) return;
    try {
      const res = await fetch(
        `http://localhost:8000/api/v1/board/collaborate/${id}/${collabUsername}`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (data.success) {
        setPopupMessage("Collaborator added!");
        setShowPopup(true);
        setCollabUsername("");
        setShowCollabInput(false);
        setTimeout(() => setShowPopup(false), 2000);
        await refreshBoards();
      } else {
        setPopupMessage(data.message || "Failed to add collaborator");
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 2000);
      }
    } catch (err) {
      console.error("Error adding collaborator:", err);
      setPopupMessage("Error adding collaborator");
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2000);
    }
  };

  if (loading) return <p>Loading board...</p>;
  if (!board) return <p>Board not found!</p>;

  return (
    <div className="board-page1">
      {/* Header */}
      <header className="board-header1">
        <button className="back-btn1" onClick={() => navigate(-1)}>← Back</button>
        <h1 className="board-page-title1">{board.name}</h1>

        {showCollabInput ? (
          <div className="collab-input-wrapper">
            <input
              type="text"
              placeholder="Enter username"
              value={collabUsername}
              onChange={(e) => setCollabUsername(e.target.value)}
              className="collab-input"
            />
            <button className="collab-add-btn" onClick={addCollaborator}>
              Add
            </button>
            <button className="collab-cancel-btn" onClick={() => setShowCollabInput(false)}>
              Cancel
            </button>
          </div>
        ) : (
          <button className="collab-btn1" onClick={() => setShowCollabInput(true)}>
            + Add Collaborators
          </button>
        )}

        <button className="delete-board-btn1" onClick={deleteBoard}>
          Delete Board
        </button>
      </header>

      {showPopup && <div className="board-success-popup1 centered-popup1">{popupMessage}</div>}

      {/* Confirmation Popup */}
      {showConfirmPopup && (
        <div className="confirm-popup-overlay">
          <div className="confirm-popup">
            <p>{confirmMessage}</p>
            <div className="confirm-btns">
              <button onClick={confirmAction} className="confirm-yes-btn">Yes</button>
              <button onClick={() => setShowConfirmPopup(false)} className="confirm-no-btn">No</button>
            </div>
          </div>
        </div>
      )}

      <div className="board-content1">
        {/* Left Side - Board Info */}
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
                  onChange={(e) => setEditedBoard({ ...editedBoard, name: e.target.value })}
                  className="edit-input1"
                />
                <textarea
                  value={editedBoard.description}
                  onChange={(e) => setEditedBoard({ ...editedBoard, description: e.target.value })}
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
                <button className="edit-btn1" onClick={startEdit}>Edit Board</button>
              </>
            )}
          </div>
        </div>

        {/* Right Side - Artworks */}
        <div className="board-artworks1">
          <h3 className="artworks-title1">Artworks in this board</h3>
          {board.arts && board.arts.length > 0 ? (
            <div className="artworks-scroll1">
              {board.arts.map((art) => (
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
              ))}
            </div>
          ) : (
            <p>No artworks added.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BoardPage1;