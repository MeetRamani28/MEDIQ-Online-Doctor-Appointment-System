const multer = require("multer");

/**
 * Enterprise Centralized Error Handler Middleware.
 * Standardizes API error responses across Mongoose, JWT, Multer, and unhandled errors.
 */
const errorHandler = (err, req, res, next) => {
  console.error("🔥 Server Error:", err.name || "Error", "-", err.message);

  // 1. Multer Upload Error
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: `File Upload Error: ${err.message}`,
    });
  }

  // 2. Custom File Filter Error
  if (err.message === "Only image files are allowed!") {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  // 3. Mongoose Validation Error
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: "Validation Failed",
      errors,
    });
  }

  // 4. Mongoose Duplicate Key Error (E11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    return res.status(409).json({
      success: false,
      message: `Duplicate entry: A record with that ${field} already exists.`,
    });
  }

  // 5. Mongoose Invalid ObjectId (CastError)
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: `Invalid ID format: ${err.value}`,
    });
  }

  // 6. JWT Errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid authentication token",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Authentication token has expired",
    });
  }

  // Fallback 500
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

module.exports = errorHandler;
