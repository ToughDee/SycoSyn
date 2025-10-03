import { APIError } from "../utils/APIError.js";


export const errorHandler = (err, req, res, next) => {
  console.log("ERROR MIDDLEWARE HIT:", err);
  if (err instanceof APIError) {
    return res.status(err.statusCode).json({
      statusCode: err.statusCode,
      success: false,
      message: err.message,
      errors: err.errors || [],
      data: err.data || null
    });
  }

  // fallback
  return res.status(500).json({
    statusCode: 500,
    success: false,
    message: err.message || "Something went wrong",
    errors: [],
    data: null
  })
}