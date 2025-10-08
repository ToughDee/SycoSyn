import { createContext, useReducer, useEffect } from "react";

export const BookmarksContext = createContext();


const initialBookmarks = [];


const bookmarksReducer = (state, action) => {
  switch (action.type) {
    case "SET_BOOKMARKS":
      return action.payload;
    case "ADD_BOOKMARK":
      return [action.payload, ...state];
    case "REMOVE_BOOKMARK":
      return state.filter((b) => b.id !== action.payload);
    default:
      return state;
  }
};

// ✅ Provider
export const BookmarksProvider = ({ children }) => {
  const [bookmarks, dispatchBookmarks] = useReducer(bookmarksReducer, initialBookmarks);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/v1/board/bookmarks",{credentials:"include"});
        const data = await res.json();
       
           const formattedData = data.data.map((item) => ({
        id: item._id,
        title: item.name || "Untitled",
        image: item.content || "",
        likes: item.likes ,
        artist:item.owner.username,
      }));
        dispatchBookmarks({ type: "SET_BOOKMARKS", payload: formattedData });
      } catch (err) {
        console.error("Failed to fetch bookmarks:", err);
      }
    };

    fetchBookmarks();
  }, []);

  return (
    <BookmarksContext.Provider value={{ bookmarks, dispatchBookmarks }}>
      {children}
    </BookmarksContext.Provider>
  );
};