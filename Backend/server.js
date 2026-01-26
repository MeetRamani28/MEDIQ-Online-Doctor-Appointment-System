require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const connectDB = require("./config/database-connection");
const errorHandler = require("./middlewares/errorHandler");

const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const adminRouter = require("./routes/adminRoutes");
const appointmentRouter = require("./routes/appointmentRoutes");
const medicalRecordRouter = require("./routes/appointmentMedicalRecordRoutes");
const specializationRouter = require("./routes/specializationRoutes");
const doctorRouter = require("./routes/doctorRoutes");

const app = express();

connectDB();

app.disable("x-powered-by");

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/appointments", appointmentRouter);
app.use("/api/medical-records", medicalRecordRouter);
app.use("/api/specializations", specializationRouter);
app.use("/api/doctor", doctorRouter);

app.get("/", (req, res) => res.status(200).send("🏥 MEDIQ Backend is Running"));

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
