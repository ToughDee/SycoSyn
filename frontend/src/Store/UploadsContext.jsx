import { createContext, useReducer } from "react";

export const UploadsContext = createContext();

// ✅ Initial state
const initialUploads = [
    {
      id: 1,
      title: "Abstract Waves",
      image:
        "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop",
      likes: 45,
      uploadDate: "2024-03-15",
    },
    {
      id: 2,
      title: "Sunset Dreams",
      image:
        "https://images.unsplash.com/photo-1549887534-1541e9326642?w=800&h=600&fit=crop",
      likes: 89,
      uploadDate: "2024-03-10",
    },
    {
      id: 3,
      title: "Urban Geometry",
      image:
        "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=800&h=600&fit=crop",
      likes: 67,
      uploadDate: "2024-03-08",
    },
    {
      id: 4,
      title: "Nature's Palette",
      image:
        "https://images.unsplash.com/photo-1515405295579-ba7b45403062?w=800&h=600&fit=crop",
      likes: 102,
      uploadDate: "2024-03-05",
    },
  ];

// ✅ Reducer
const uploadsReducer = (state, action) => {
  switch (action.type) {
    case "ADD_UPLOAD":
      return [action.payload, ...state];
    case "DELETE_UPLOAD":
      return state.filter((u) => u.id !== action.payload);
    case "UPDATE_LIKES":
      return state.map((u) =>
        u.id === action.payload.id ? { ...u, likes: action.payload.likes } : u
      );
    default:
      return state;
  }
};

// ✅ Provider
export const UploadsProvider = ({ children }) => {
  const [uploads, dispatchUploads] = useReducer(uploadsReducer, initialUploads);

  return (
    <UploadsContext.Provider value={{ uploads, dispatchUploads }}>
      {children}
    </UploadsContext.Provider>
  );
};