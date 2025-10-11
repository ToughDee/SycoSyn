import React, { createContext, useState, useEffect } from "react";

export const BoardsContext = createContext();

export const BoardsProvider = ({ children }) => {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const fetchBoardsForUser = async (userId) => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/board/user/${userId}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) setBoards(data.data || []);
    } catch (err) {
      console.error("Error fetching boards:", err);
      setBoards([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadUserAndBoards = async () => {
      setLoading(true);
      try {
        const userRes = await fetch("http://localhost:8000/api/v1/user/current-user", {
          credentials: "include",
        });
        const userData = await userRes.json();
        if (!userData.success) throw new Error("Failed to get user");
        setUser(userData.data);

        // ✅ Fetch boards AFTER user is set
        await fetchBoardsForUser(userData.data._id);
      } catch (err) {
        console.error("Error fetching user or boards:", err);
        setBoards([]);
      } finally {
        setLoading(false);
      }
    };

    loadUserAndBoards();
  }, []);


  // create board


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

  const refreshBoards = async () => {
    if (user) await fetchBoardsForUser(user._id);
  };

  return (
    <BoardsContext.Provider
      value={{
        boards,
        user,
        loading,
        refreshBoards,
        createBoard,
      }}
    >
      {children}
    </BoardsContext.Provider>
  );
};