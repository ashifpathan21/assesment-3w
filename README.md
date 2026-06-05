# Social Media Feed App

A modern, real-time social media feed and blogging web application built with **React**, **TypeScript**, **Node.js**, **Express**, **MongoDB**, and **Socket.io**. It enables users to share posts, upload media using Cloudinary, interact with posts in real time (likes and comments), and view profiles.

---

## 🌐 Live Application URL
> **Live Site URL:** `[https://assesment-3w.onrender.com]` <!-- Keep this placeholder space for adding the site URL later -->

---

## 🔑 Test Login Credentials
For ease of manual testing, a pre-configured demo account is available. **These credentials have been automatically attached and pre-filled on the login screen form.**

* **Email:** `vlogstheash@gmail.com`
* **Password:** `123456`

---

## 🚀 Key Features

* **User Authentication:** Secure Sign Up, Login, and state persistence via JWT (JSON Web Tokens).
* **Interactive Feed:** A dynamic workspace where users can browse, search, and filter posts.
* **Post Creation:** Users can publish new posts with text and image attachments (powered by Cloudinary for media uploads).
* **Real-Time Social Interactions (Socket.io):**
  * Instant like/unlike updates on posts.
  * Real-time commenting (add and delete comments).
  * Real-time notifications sent to the post author when another user likes or comments on their post.
* **User Profile Page:** Displays user-specific details, count of likes, and a history of their posts.
* **Responsive UI:** Built using Google's **Material UI (MUI)** for an elegant, responsive experience on desktop and mobile.

---

## 🛠️ Technology Stack

### Frontend
* **Core:** React 19, TypeScript
* **Build Tool:** Vite
* **Styling:** Material UI (MUI), Emotion CSS
* **Routing:** React Router DOM v7
* **State & Networking:** Axios for API calls, Socket.io-client for real-time WebSocket communication
* **User Feedback:** React Hot Toast for modern toast alerts

### Backend
* **Core:** Node.js, Express, TypeScript
* **Database:** MongoDB (using Mongoose ODM)
* **Real-time Engine:** Socket.io
* **Authentication:** JWT (JSON Web Tokens), Argon2 (hashing passwords)
* **Storage & Uploads:** Cloudinary, Multer (multipart form handling)

---

## 📂 Project Structure

```text
assesment/
├── BACKEND/                    # Node.js + Express backend server
│   ├── src/
│   │   ├── config/             # DB and JWT configurations
│   │   ├── controllers/        # Business logic for REST API routes
│   │   ├── middlewares/        # Authentication and file-upload middlewares
│   │   ├── models/             # Mongoose schemas (User, Post, Like, Comment)
│   │   ├── routes/             # Express API routing definition
│   │   ├── server.ts           # App initialization & middleware setup
│   │   └── index.ts            # Entrypoint (HTTP Server + Socket.io event listeners)
│   ├── .env.example            # Sample environment file for server setup
│   └── package.json
│
├── FRONTEND/                   # React + Vite client application
│   ├── src/
│   │   ├── apis/               # Axios API instances and service definitions
│   │   ├── components/         # Reusable layouts, post cards, filters, profile headers
│   │   ├── context/            # React context providers
│   │   ├── pages/              # Auth, Feed, Profile, and NotFound view components
│   │   ├── theme.tsx           # MUI design theme customized colors and styling
│   │   ├── App.tsx             # Main router and protected routes checker
│   │   └── main.tsx            # React application mount point
│   ├── .env.example            # Sample environment file for client configuration
│   └── package.json
│
└── README.md                   # Main project documentation (this file)
```

---

## ⚙️ Environment Configuration

Before running the application, you need to configure the environment variables for both the backend and frontend.

### 1. Backend Environment Setup (`/BACKEND`)
Copy `BACKEND/.env.example` to `BACKEND/.env` and fill in your details:
```bash
cd BACKEND
cp .env.example .env
```
Fill in the following variables in the `.env` file:
* `PORT`: Port on which the backend server will listen (default: `3001`).
* `MONGO_URI`: Your MongoDB connection string (local instance or MongoDB Atlas).
* `JWT_SECRET`: A secret string used to sign JSON Web Tokens.
* `FRONTEND_URI`: The URL of the running frontend application (e.g., `http://localhost:5173`).
* `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: Credentials from your Cloudinary Dashboard to support image uploads.

### 2. Frontend Environment Setup (`/FRONTEND`)
Copy `FRONTEND/.env.example` to `FRONTEND/.env`:
```bash
cd ../FRONTEND
cp .env.example .env
```
Ensure the endpoints align with your backend configuration:
* `VITE_BASE_URL`: REST API root URL (default: `http://localhost:3001/api/v1`).
* `VITE_SOCKET_URL`: Socket.io server URL (default: `http://localhost:3001`).

---

## 🏃 Setup and Initialization Instructions

Follow these steps to initialize and run the project locally.

### Prerequisites
* **Node.js** (v18.x or above recommended)
* **npm** (v9.x or above)
* **MongoDB** (running locally or a cloud account on MongoDB Atlas)

---

### Step 1: Install Dependencies

Open two separate terminal instances (one for the backend, one for the frontend).

**In the Backend Terminal:**
```bash
cd BACKEND
npm install
```

**In the Frontend Terminal:**
```bash
cd FRONTEND
npm install
```

---

### Step 2: Run the Application (Development Mode)

**In the Backend Terminal:**
```bash
cd BACKEND
npm run dev
```
*This command runs the TypeScript build and starts the server. You should see `Server is running on PORT=3001` (or your customized port) and a database connection success message.*

**In the Frontend Terminal:**
```bash
cd FRONTEND
npm run dev
```
*Vite will start the dev server and output a local address (usually `http://localhost:5173`). Open this URL in your web browser to test the application.*

---

### Step 3: Production Build (Optional)

If you wish to test a production-ready build:

**Backend:**
```bash
cd BACKEND
npm run build
npm start
```

**Frontend:**
```bash
cd FRONTEND
npm run build
npm run preview
```
