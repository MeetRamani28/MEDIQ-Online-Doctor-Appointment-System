const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const session = require("express-session");
const cors = require("cors");
require("dotenv").config();
const multer = require("multer");

require("./config/database-connection");

const authRouter = require("./routes/authRoutes");

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  session({
    name: "mediq.sid",
    secret:
      process.env.EXPRESS_SESSION_SECRET ||
      "MEDIQDOCTORAPPONTMENTSYSTEMSESSIONSECRET",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use("/auth", authRouter);

app.get("/", (req, res) => {
  res.send("Welcome To MEDIQ Backend!...🏥");
});

app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  if (err.message === "Only image files are allowed!") {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  res.status(500).json({
    success: false,
    message: "Something went wrong!",
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
