import React, { createContext, useState, useEffect } from "react";

export const BoardsContext = createContext();

export const BoardsProvider = ({ children }) => {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // ✅ Fetch boards (used in multiple places)
  const fetchBoardsForUser = async (userId) => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/board/user/${userId}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) setBoards(data.data || []);
    } catch (err) {
      console.error("Error fetching boards:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Initial load
  useEffect(() => {
    const loadUserAndBoards = async () => {
      try {
        const userRes = await fetch("http://localhost:8000/api/v1/user/current-user", {
          credentials: "include",
        });
        const userData = await userRes.json();
        if (!userData.success) throw new Error("Failed to get user");
        setUser(userData.data);
        await fetchBoardsForUser(userData.data._id);
      } catch (err) {
        console.error("Error fetching user or boards:", err);
        setLoading(false);
      }
    };

    loadUserAndBoards();
  }, []);

  // ✅ Create board (and refresh after creating)
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
          owner: user._id,
        }),
      });

      const data = await res.json();
      if (data.success) {
        // Option 1: Just append it
        setBoards((prev) => [...prev, data.data]);
        // Option 2 (better): Re-fetch to ensure fresh data
        await fetchBoardsForUser(user._id);
        return data.data;
      }
      return null;
    } catch (err) {
      console.error("Error creating board:", err);
      return null;
    }
  };

  // ✅ Refresh boards manually (export this)
  const refreshBoards = async () => {
    if (user) {
      await fetchBoardsForUser(user._id);
    }
  };

  return (
    <BoardsContext.Provider
      value={{
        boards,
        user,
        loading,
        createBoard,
        refreshBoards, // ✅ exported
      }}
    >
      {children}
    </BoardsContext.Provider>
  );
};