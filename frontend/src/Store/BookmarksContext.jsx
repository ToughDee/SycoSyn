import { createContext, useReducer } from "react";

export const BookmarksContext = createContext();

// ✅ Initial state
const initialBookmarks = [
  {
    id: 1,
    title: "Cosmic Reflections",
    artist: "Sarah Johnson",
    image: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800&h=600&fit=crop",
    likes: 234,
    
  },
  {
    id: 2,
    title: "Minimal Elegance",
    artist: "Alex Chen",
    image: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&h=600&fit=crop",
    likes: 189,
   
  },
  {
    id: 3,
    title: "Digital Horizons",
    artist: "Maria Garcia",
    image: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800&h=600&fit=crop",
    likes: 312,
    
  },
  {
    id: 4,
    title: "Color Symphony",
    artist: "James Wilson",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=600&fit=crop",
    likes: 456,
   
  },
  {
    id: 5,
    title: "Ethereal Visions",
    artist: "Emma Davis",
    image: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&h=600&fit=crop",
    likes: 267,
    
  },
  {
    id: 6,
    title: "Modern Abstract",
    artist: "David Lee",
    image: "https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?w=800&h=600&fit=crop",
    likes: 198,
  
  },
];

// ✅ Reducer
const bookmarksReducer = (state, action) => {
  switch (action.type) {
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

  return (
    <BookmarksContext.Provider value={{ bookmarks, dispatchBookmarks }}>
      {children}
    </BookmarksContext.Provider>
  );
};