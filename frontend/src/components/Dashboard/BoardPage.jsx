import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./BoardPage.css";

const BoardPage1 = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [board, setBoard] = useState(null);
  const [editedBoard, setEditedBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  // 🔹 Fetch board by ID
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

  // 🔹 Edit handlers
  const startEdit = () => setEditMode(true);
  const cancelEdit = () => {
    setEditedBoard({ ...board });
    setEditMode(false);
  };

  // 🔹 Handle image change
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

  // 🔹 Save board (with FormData)
  const saveBoard = async () => {
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
        setBoard(data.data);
        setEditMode(false);
      } else {
        alert("Failed to update board");
      }
    } catch (err) {
      console.error("Error updating board:", err);
    }
  };

  // 🔹 Delete board
  const deleteBoard = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this board?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:8000/api/v1/board/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        alert("Board deleted successfully!");
        navigate("/user-profile");
      } else {
        alert("Failed to delete board");
      }
    } catch (err) {
      console.error("Error deleting board:", err);
    }
  };

  // 🔹 Delete individual artwork
  const deleteArtwork = async (artId) => {
    const confirmDel = window.confirm("Delete this artwork from board?");
    if (!confirmDel) return;

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
      } else {
        alert("Failed to delete artwork");
      }
    } catch (err) {
      console.error("Error deleting artwork:", err);
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
        <button className="collab-btn1" onClick={() => alert("Add collaborator soon!")}>
          + Add Collaborators
        </button>
        <button className="delete-board-btn1 " onClick={deleteBoard} >
          Delete Board
        </button>
      </header>

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
                  <button className="save-btn1" onClick={saveBoard}>Save</button>
                  <button className="cancel-btn1" onClick={cancelEdit}>Cancel</button>
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
          <div className="artworks-scroll1">
            {board.arts?.map((art) => (
              <div key={art._id} className="art-card1" style={{ position: "relative" }}>
                <img src={art.content} alt={art.name} className="art-image1" />
                {editMode && (
                  <button
                    className="delete-art-btn1"
                    onClick={() => deleteArtwork(art._id)}
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
        </div>
      </div>
    </div>
  );
};

export default BoardPage1;