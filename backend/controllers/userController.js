import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please fill all fields" });
        }

        // Check if user already exists
        const userExists = await User.findOne({ email: email.toLowerCase() });
        if (userExists) {
            return res.status(400).json({ message: "User already exists with this email" });
        }

        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password,
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            streak: user.streak,
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error("Register error:", error.message);
        res.status(500).json({ message: "Server Error during registration" });
    }
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Please enter email and password" });
        }

        const user = await User.findOne({ email: email.toLowerCase() });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                streak: user.streak,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        console.error("Login error:", error.message);
        res.status(500).json({ message: "Server Error during login" });
    }
};

// @desc    Get user profile (streak data)
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server Error fetching user profile" });
    }
};

// @desc    Update study streak
// @route   POST /api/users/streak
// @access  Private
export const updateStudyStreak = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let lastStudied = user.lastStudiedDate ? new Date(user.lastStudiedDate) : null;
        if (lastStudied) {
            lastStudied.setHours(0, 0, 0, 0);
        }

        // Check if already studied today
        if (lastStudied && lastStudied.getTime() === today.getTime()) {
            return res.status(400).json({ message: "Already completed study session today!" });
        }

        // Calculate difference in days
        let streakIncrement = 1;
        if (lastStudied) {
            const diffTime = Math.abs(today - lastStudied);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays > 1 && user.streak > 0) {
                // Streak broken
                user.streak = 0;
            }
        }

        user.streak += streakIncrement;
        user.lastStudiedDate = new Date();

        const updatedUser = await user.save();
        res.json(updatedUser);

    } catch (error) {
        res.status(500).json({ message: "Server Error updating streak" });
    }
};

// @desc    Update notification settings
// @route   PUT /api/users/notification
// @access  Private
export const updateNotificationSettings = async (req, res) => {
    try {
        const { time, enabled } = req.body;
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (time !== undefined) user.notificationTime = time;
        if (enabled !== undefined) user.notificationEnabled = Boolean(enabled);

        const updatedUser = await user.save();
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Server Error updating notification settings" });
    }
};
