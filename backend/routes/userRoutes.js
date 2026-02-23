import express from "express";
import {
    registerUser,
    loginUser,
    getUserProfile,
    updateStudyStreak,
    updateNotificationSettings
} from "../controllers/userController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.route("/profile").get(protect, getUserProfile);
router.route("/streak").post(protect, updateStudyStreak);
router.route("/notification").put(protect, updateNotificationSettings);

export default router;
