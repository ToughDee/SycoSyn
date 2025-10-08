import { createContext, useReducer, useEffect } from "react";

export const UploadsContext = createContext();

const initialUploads = [];

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

export const UploadsProvider = ({ children }) => {
  const [uploads, dispatchUploads] = useReducer(uploadsReducer, initialUploads);

  // ✅ Function to fetch uploads (can be reused)
  const fetchUploads = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/art/my", {
        credentials: "include",
      });
      const data = await res.json();

      const formattedData = data.data.map((item) => ({
        id: item._id,
        title: item.name || "Untitled",
        image: item.content || "",
        likes: item.likes || 0,
        uploadDate: item.createdAt,
      }));

      dispatchUploads({ type: "SET_UPLOADS", payload: formattedData });
    } catch (err) {
      console.error("Failed to fetch uploads:", err);
    }
  };

  const deleteUpload = async (id) => {
  try {
    const res = await fetch(`http://localhost:8000/api/v1/art/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Failed to delete upload");
    }

    dispatchUploads({ type: "DELETE_UPLOAD", payload: id });
  } catch (err) {
    console.error("Error deleting upload:", err);
  }
};

  useEffect(() => {
    fetchUploads();
  }, []);

  return (
    <UploadsContext.Provider value={{ uploads, dispatchUploads, fetchUploads, deleteUpload}}>
      {children}
    </UploadsContext.Provider>
  );
};