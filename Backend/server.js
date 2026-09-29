require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const connectDB = require("./config/database-connection");
const errorHandler = require("./middlewares/errorHandler");
const requestLogger = require("./middlewares/logger");
const startKeepAlive = require("./utils/keepAlive");
const seedDemoUsers = require("./utils/seedDemoUsers");

const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const adminRouter = require("./routes/adminRoutes");
const appointmentRouter = require("./routes/appointmentRoutes");
const medicalRecordRouter = require("./routes/appointmentMedicalRecordRoutes");
const specializationRouter = require("./routes/specializationRoutes");
const doctorRouter = require("./routes/doctorRoutes");
const contactRouter = require("./routes/contactRoutes");

const app = express();

connectDB().then(() => {
  seedDemoUsers();
});

app.disable("x-powered-by");
app.use(requestLogger);

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check & Heartbeat endpoints for Render keep-alive
app.get(["/health", "/api/health"], (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "MEDIQ-Backend",
    message: "Server is alive and healthy",
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// System telemetry & metrics endpoint
app.get("/api/system/stats", (req, res) => {
  const memory = process.memoryUsage();
  res.status(200).json({
    success: true,
    system: {
      name: "MEDIQ Healthcare API",
      nodeVersion: process.version,
      platform: process.platform,
      uptimeSeconds: Math.floor(process.uptime()),
      memoryUsageMB: {
        rss: (memory.rss / 1024 / 1024).toFixed(2),
        heapTotal: (memory.heapTotal / 1024 / 1024).toFixed(2),
        heapUsed: (memory.heapUsed / 1024 / 1024).toFixed(2),
      },
    },
  });
});

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/appointments", appointmentRouter);
app.use("/api/medical-records", medicalRecordRouter);
app.use("/api/specializations", specializationRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/contact", contactRouter);

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
  // Start background keep-alive worker daemon
  startKeepAlive();
});
