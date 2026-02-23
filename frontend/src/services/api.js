// frontend/src/services/api.js

import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api"
});

// Attach JWT token to every request if available
API.interceptors.request.use((config) => {
    const userInfo = sessionStorage.getItem("userInfo");
    if (userInfo) {
        const { token } = JSON.parse(userInfo);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// Auth APIs
export const registerUser = (data) => API.post("/users/register", data);
export const loginUser = (data) => API.post("/users/login", data);

// Get all topics
export const getTopics = () => API.get("/topics");

// Get topic by slug
export const getTopicBySlug = (slug) => API.get(`/topics/${slug}`);

// Create topic (for future admin panel)
export const createTopic = (data) => API.post("/topics", data);

// Toggle problem completion
export const toggleProblemCompletion = (topicSlug, problemId) => API.patch(`/topics/${topicSlug}/problems/${problemId}`);

// User Profile & Streak APIs
export const getUserProfile = () => API.get("/users/profile");
export const updateStreak = () => API.post("/users/streak");
export const updateNotificationSettings = (data) => API.put("/users/notification", data);