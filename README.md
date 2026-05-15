# 💪 Be Fit — Smart Health & Fitness Tracker

> A full-stack MERN web application with AI-powered fitness insights, PWA support, and beautiful glassmorphism UI.

![Tech Stack](https://img.shields.io/badge/Stack-MERN-green) ![License](https://img.shields.io/badge/License-MIT-blue)

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Folder Structure](#folder-structure)
5. [Getting Started](#getting-started)
6. [Environment Variables](#environment-variables)
7. [API Reference](#api-reference)
8. [Deployment Guide](#deployment-guide)
9. [Screenshots](#screenshots)

---

## 🏋️ Project Overview

**Be Fit** is a production-ready health and fitness tracking web application built with the MERN stack. Users can create accounts, log workouts and meals, set fitness goals, and receive AI-generated health suggestions based on their data.

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure login/register with bcrypt password hashing
- 📊 **Dashboard** — Real-time stats with interactive Recharts visualizations
- 🏋️ **Workout Tracker** — Log exercises with type, duration, calories, sets/reps
- 🥗 **Nutrition Tracker** — Track meals with full macro breakdown (protein/carbs/fats)
- 🎯 **Goal Setting** — Set weight, calorie, protein, and workout goals
- 🤖 **AI Suggestions** — Rule-based smart fitness recommendations from your data
- 👤 **Profile Management** — Update profile, BMI calculator, change password
- ⚙️ **Admin Dashboard** — View all users, analytics, enable/disable/delete users
- 📱 **PWA** — Installable on mobile, works offline
- 🌙 **Dark/Light Mode** — Toggle between themes
- 🔍 **Search & Filter** — Search workouts, filter by type
- 📄 **Pagination** — Efficient data loading

---

## 🛠️ Tech Stack

| Layer      | Technology                                 |
|------------|--------------------------------------------|
| Frontend   | React.js, Tailwind CSS, React Router DOM   |
| Charts     | Recharts                                   |
| HTTP       | Axios                                      |
| State      | React Context API                          |
| Backend    | Node.js, Express.js                        |
| Auth       | JWT (jsonwebtoken), bcryptjs               |
| Database   | MongoDB Atlas, Mongoose                    |
| Deployment | Vercel (frontend), Render (backend)        |

---

## 📁 Folder Structure

```
fitsync-ai/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # Register & login
│   │   ├── userController.js      # Profile management
│   │   ├── workoutController.js   # Workout CRUD
│   │   ├── nutritionController.js # Meal CRUD
│   │   ├── goalController.js      # Goal management
│   │   ├── aiController.js        # AI suggestions
│   │   └── adminController.js     # Admin actions
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT verification, role guard
│   ├── models/
│   │   ├── User.js                # User schema
│   │   ├── Workout.js             # Workout schema
│   │   ├── Meal.js                # Meal schema
│   │   └── Goal.js                # Goal schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── workoutRoutes.js
│   │   ├── nutritionRoutes.js
│   │   ├── goalRoutes.js
│   │   ├── aiRoutes.js
│   │   └── adminRoutes.js
│   ├── .env
│   ├── package.json
│   └── server.js                  # Express app entry point
│
└── frontend/
    ├── public/
    │   ├── index.html
    │   ├── manifest.json           # PWA manifest
    │   └── service-worker.js       # PWA offline support
    ├── src/
    │   ├── components/
    │   │   └── common/
    │   │       ├── Layout.jsx       # App shell with sidebar
    │   │       ├── Sidebar.jsx      # Navigation sidebar
    │   │       └── ProtectedRoute.jsx
    │   ├── context/
    │   │   ├── AuthContext.js       # Global auth state
    │   │   └── ThemeContext.js      # Dark/light mode
    │   ├── pages/
    │   │   ├── LandingPage.jsx      # Marketing homepage
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── DashboardPage.jsx    # Main dashboard
    │   │   ├── WorkoutPage.jsx
    │   │   ├── NutritionPage.jsx
    │   │   ├── GoalsPage.jsx
    │   │   ├── AIPage.jsx
    │   │   ├── ProfilePage.jsx
    │   │   └── AdminPage.jsx
    │   ├── utils/
    │   │   └── api.js               # Axios instance
    │   ├── App.jsx                  # Router setup
    │   ├── index.js                 # React entry point
    │   └── index.css                # Global styles + Tailwind
    ├── .env
    ├── package.json
    └── tailwind.config.js
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier)
- Git

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/fitsync-ai.git
cd fitsync-ai
```

### 2. Backend Setup
```bash
cd backend
npm install
# Edit backend/.env with your MongoDB URI and JWT secret
npm run dev
# Server starts at http://localhost:5001
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
# frontend/.env already points to http://localhost:5001/api
npm start
# App opens at http://localhost:3000
```

---

## 🔑 Environment Variables

### Backend `.env`
```env
PORT=5001
NODE_ENV=development
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/fitsync_ai
JWT_SECRET=your_very_long_random_secret_key_here
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:3000
```

### Frontend `.env`
```env
REACT_APP_API_URL=http://localhost:5001/api
```

---

## 📡 API Reference

### Auth
| Method | Endpoint              | Description          |
|--------|-----------------------|----------------------|
| POST   | /api/auth/register    | Register new user    |
| POST   | /api/auth/login       | Login, returns JWT   |

### User (🔒 protected)
| Method | Endpoint                    | Description           |
|--------|-----------------------------|-----------------------|
| GET    | /api/user/profile           | Get my profile        |
| PUT    | /api/user/profile           | Update profile        |
| PUT    | /api/user/change-password   | Change password       |

### Workouts (🔒 protected)
| Method | Endpoint                    | Description                        |
|--------|-----------------------------|------------------------------------|
| POST   | /api/workouts               | Log a workout                      |
| GET    | /api/workouts               | Get workouts (search, filter, page)|
| GET    | /api/workouts/analytics     | Weekly workout chart data          |
| DELETE | /api/workouts/:id           | Delete a workout                   |

### Meals (🔒 protected)
| Method | Endpoint                    | Description           |
|--------|-----------------------------|-----------------------|
| POST   | /api/meals                  | Log a meal            |
| GET    | /api/meals                  | Get meals + today totals |
| GET    | /api/meals/analytics        | Weekly meal chart data|
| DELETE | /api/meals/:id              | Delete a meal         |

### Goals (🔒 protected)
| Method | Endpoint    | Description         |
|--------|-------------|---------------------|
| POST   | /api/goals  | Set / update goals  |
| GET    | /api/goals  | Get goals + progress|

### AI (🔒 protected)
| Method | Endpoint              | Description                |
|--------|-----------------------|----------------------------|
| POST   | /api/ai/suggestions   | Generate AI fitness tips   |

### Admin (🔒🔒 admin only)
| Method | Endpoint                    | Description           |
|--------|-----------------------------|-----------------------|
| GET    | /api/admin/users            | List all users        |
| GET    | /api/admin/analytics        | Platform analytics    |
| DELETE | /api/admin/user/:id         | Delete a user         |
| PUT    | /api/admin/user/:id/toggle  | Enable/disable user   |

---

## 🌐 Deployment Guide

### MongoDB Atlas Setup
1. Go to [cloud.mongodb.com](https://cloud.mongodb.com) → Create free cluster
2. Database Access → Add user with read/write permissions
3. Network Access → Add `0.0.0.0/0` (allow all IPs)
4. Connect → Drivers → Copy connection string

### Backend on Render (free)
1. Push code to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your GitHub repo → select `backend` folder
4. Build command: `npm install`
5. Start command: `npm start`
6. Add all environment variables from `.env`
7. Deploy → copy your Render URL

### Frontend on Vercel (free)
1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo → set Root Directory to `frontend`
3. Add environment variable: `REACT_APP_API_URL=https://your-backend.onrender.com/api`
4. Deploy → your app is live!

### Create Admin User
After deploying, register normally, then in MongoDB Atlas:
1. Go to your cluster → Browse Collections → `users`
2. Find your user → Edit → change `role` from `"user"` to `"admin"`
3. Save → you now have admin access at `/admin`

---

## 👨‍💻 Built With

- **MERN Stack**: MongoDB, Express.js, React.js, Node.js
- **Tailwind CSS** for glassmorphism UI
- **Recharts** for data visualization
- **JWT + bcrypt** for secure authentication
- **PWA** for installable mobile experience

---

*University Mini Project — Be Fit | Your Effort. Your Result.*
