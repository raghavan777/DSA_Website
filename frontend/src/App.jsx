// frontend/src/App.jsx

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React, { useEffect } from "react";
import { getUserProfile } from "./services/api";
import { startNotificationScheduler } from "./utils/notificationScheduler";
import Home from "./pages/Home";
import TopicDetail from "./pages/TopicDetail";
import Learn from "./pages/Learn";
import Reminders from "./pages/Reminders";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const userInfo = sessionStorage.getItem("userInfo");
  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  useEffect(() => {
    const initNotificationScheduler = async () => {
      const userInfo = sessionStorage.getItem("userInfo");
      if (!userInfo) return;

      try {
        const { data } = await getUserProfile();

        if (
          data.notificationEnabled &&
          data.notificationTime &&
          Notification.permission === "granted"
        ) {
          startNotificationScheduler(
            data.notificationTime,
            data.name || "Student"
          );
        }
      } catch (err) {
        if (err.response?.status === 401) {
          sessionStorage.removeItem("userInfo");
        }
      }
    };

    initNotificationScheduler();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/learn" element={<ProtectedRoute><Learn /></ProtectedRoute>} />
        <Route path="/reminders" element={<ProtectedRoute><Reminders /></ProtectedRoute>} />
        <Route path="/topic/:slug" element={<ProtectedRoute><TopicDetail /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;