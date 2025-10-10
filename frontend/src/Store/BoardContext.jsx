import React, { createContext, useState, useEffect } from "react";

export const BoardsContext = createContext();

export const BoardsProvider = ({ children }) => {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchBoardsForUser = async () => {
      try {
        // 1️⃣ Fetch current logged-in user first
        const userRes = await fetch("http://localhost:8000/api/v1/user/current-user", {
          credentials: "include",
        });
        const userData = await userRes.json();
        if (!userData.success) throw new Error("Failed to get user");
        setUser(userData.data);

        // 2️⃣ Then fetch boards for that user ID
        const res = await fetch(
          `http://localhost:8000/api/v1/board/user/${userData.data._id}`,
          { credentials: "include" }
        );
        const data = await res.json();
        if (data.success) setBoards(data.data || []);
      } catch (err) {
        console.error("Error fetching user boards:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBoardsForUser();
  }, []);


  // inside BoardsProvider
const createBoard = async (name, description) => {
  if (!user) return null;

  try {
    const res = await fetch("http://localhost:8000/api/v1/board", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        description,
        owner: user._id, // tie board to current user
      }),
    });

    const data = await res.json();
    if (data.success) {
      setBoards((prev) => [...prev, data.data]); // add newly created board to context
      return data.data;
    } else {
      console.error("Failed to create board:", data.message);
      return null;
    }
  } catch (err) {
    console.error("Error creating board:", err);
    return null;
  }
};

  return (
    <BoardsContext.Provider value={{ boards, user, loading,createBoard }}>
      {children}
    </BoardsContext.Provider>
  );
};