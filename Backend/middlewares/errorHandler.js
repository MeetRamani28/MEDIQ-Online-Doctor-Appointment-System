const multer = require("multer");

const errorHandler = (err, req, res, next) => {
  console.error("🔥 Error:", err);

  if (err instanceof multer.MulterError) {
    return res.status(400).json({ success: false, message: err.message });
  }

  if (err.message === "Only image files are allowed!") {
    return res.status(400).json({ success: false, message: err.message });
  }

  res.status(500).json({ success: false, message: "Internal Server Error" });
};

module.exports = errorHandler;
