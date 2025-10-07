import { createContext, useReducer, useEffect } from "react";

export const UploadsContext = createContext();

// ✅ Initial state
const initialUploads = [];

// ✅ Reducer
const uploadsReducer = (state, action) => {
  switch (action.type) {
    case "SET_UPLOADS":
      return action.payload;
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

  useEffect(() => {
 
    const fetchUploads = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/v1/art/my" ,{credentials:"include"});
        const data = await res.json();
        // Transform data to match your uploads structure
        const formattedData = data.data.map((item) => ({
          id: item._id,
          title: item.name || "Untitled",
          image: item.content || "",
          likes: item.likes || 0,
          uploadDate:item.createdAt,
        }));
        dispatchUploads({ type: "SET_UPLOADS", payload: formattedData });
      } catch (err) {
        console.error("Failed to fetch uploads:", err);
      }
    };

    fetchUploads();
  }, []);

  return (
    <UploadsContext.Provider value={{ uploads, dispatchUploads }}>
      {children}
    </UploadsContext.Provider>
  );
};