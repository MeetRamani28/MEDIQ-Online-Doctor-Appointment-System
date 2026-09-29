# 🩺 MEDIQ — Enterprise Online Doctor Appointment System

**MEDIQ** is a full-stack, production-grade MERN web application designed to digitize doctor appointment booking, clinical scheduling, patient medical record tracking, and system-level administrative platform control.

[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-black?logo=three.js)](https://threejs.org/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-State-purple?logo=redux)](https://redux-toolkit.js.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-emerald?logo=mongodb)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-blue)](#license)

---

## 🚀 Key Features & Highlights

### 🎨 **Frontend Architecture & UI**
- **Full-Screen Locked Auth Layout**: Edge-to-edge 100vh viewport design with locked page scrolling, inner form container scroll, and unified MEDIQ primary brand blue (`#0052CC`) theme.
- **WebGL 3D Interactive Canvas**: Built with Three.js rendering dynamic 3D medical particle spheres with mouse-reactive camera parallax in the auth hero panel.
- **Route-Level Code Splitting**: React `lazy()` and `<Suspense>` route splitting reduces initial JS payload down to **~30 kB per-route chunk**.
- **Dynamic Heartbeat Loading Screen**: Framer Motion heartbeat loader with automatic Render cold-start status notifications.
- **Responsive 404 Not Found Page**: Glassmorphic 404 error page with animated badge graphics and instant navigation controls.
- **Clean Toast Notifications**: Streamlined, non-intrusive notification system firing exclusively on action completion and errors.

### ⚙️ **Backend & Infrastructure**
- **Automated Keep-Alive Worker Daemon**: Self-pinging HTTP heartbeat worker running every 12 minutes to eliminate Render free-tier 15-minute sleep timeouts.
- **AI Tesseract OCR License Verification**: Automatic medical license document parsing & pre-verification.
- **Role-Based Access Control (RBAC)**: Enforced middleware security for `PATIENT`, `DOCTOR`, and `ADMIN` roles.
- **Database Query Acceleration**: Mongoose `.lean()` execution and compound index strategy (`{ doctor: 1, appointmentDate: 1, appointmentTime: 1 }`).
- **HTTP Request Logger & Error Handler**: Structured request logging with status indicators and centralized error handling (Mongoose Validation, E11000 Duplicate Key, JWT, and Multer errors).
- **Auto Demo Accounts Seeder**: Automatic seeding of default demo accounts upon MongoDB connection.

---

## 🔑 Demo Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Patient** | `patient@mediq.care` | `Password123!` |
| **Doctor** | `doctor@mediq.care` | `Password123!` |
| **Admin** | `admin@mediq.care` | `Password123!` |

---

## 🏗️ Architecture & Project Structure

```
MEDIQ/
├── ⚙️ Backend/
│   ├── config/              # MongoDB connection & Multer upload config
│   ├── controllers/         # Business logic (admin, doctor, user, auth, etc.)
│   ├── middlewares/         # Auth RBAC, ErrorHandler, Request Logger
│   ├── model/               # Mongoose Schemas (User, Appointment, Specialization, etc.)
│   ├── routes/              # RESTful API route declarations
│   ├── utils/               # Keep-Alive daemon, Demo Seeder, Password Hash & JWT
│   └── server.js            # Express application entry point
│
└── 🎨 Frontend/
    ├── src/
    │   ├── components/      # ThreeCanvas WebGL, LoadingScreen, DoctorCard, UI Atoms
    │   ├── features/        # Redux Toolkit Slices & Async Thunks
    │   ├── layouts/         # AdminLayout, DoctorLayout, PatientLayout
    │   ├── pages/           # Role-based pages (ADMIN, DOCTOR, PATIENT, AuthPage, NotFound)
    │   ├── routes/          # Lazy-loaded Routing definitions with Suspense & /login alias
    │   └── store/           # Redux Store configuration
    └── vite.config.js       # Rollup vendor bundle splitting
```

---

## 💻 Local Setup & Installation

### 1. Prerequisites
- Node.js (v18+ recommended)
- MongoDB Database (Local or MongoDB Atlas)

### 2. Backend Setup
```bash
cd Backend
npm install
npm start
```
Create a `.env` file in `/Backend`:
```env
PORT=3000
JWT_SECRET=your_jwt_secret
MONGO_URI=your_mongodb_connection_string
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3000
```

### 3. Frontend Setup
```bash
cd Frontend
npm install
npm run dev
```
Create a `.env` file in `/Frontend`:
```env
VITE_API_URL=http://localhost:3000/api/
```

---

## 🌐 Deployment Links

- **Live Frontend (Vercel)**: [mediq-frontend-delta.vercel.app](https://mediq-frontend-delta.vercel.app/)
- **Live Backend (Render)**: [mediq-backend-mf7h.onrender.com](https://mediq-backend-mf7h.onrender.com/)

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
