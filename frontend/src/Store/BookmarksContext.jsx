import { createContext, useReducer, useEffect } from "react";

export const BookmarksContext = createContext();

// ✅ Initial state
const initialBookmarks = [];

// ✅ Reducer
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
        const res = await fetch("https://jsonplaceholder.typicode.com/photos?_limit=10");
        const data = await res.json();
        // Format data to match your bookmarks structure
        const formattedData = data.map((item) => ({
          id: item.id,
          title: item.title,
          artist: "Dummy Artist",
          image: item.url,
          likes: Math.floor(Math.random() * 100),
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