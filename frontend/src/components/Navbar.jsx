// frontend/src/components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUserProfile } from "../services/api";
import "./Navbar.css";

const Navbar = ({ activePage }) => {
    const [navStreak, setNavStreak] = useState(0);
    const [userName, setUserName] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNavData = async () => {
            try {
                const { data } = await getUserProfile();
                setNavStreak(data.streak || 0);
                setUserName(data.name || "User");
            } catch (err) {
                console.error("Failed to load nav streak", err);
            }
        };
        fetchNavData();
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem("userInfo");
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <div className="nav-brand">
                <span className="nav-spark">✨</span> {userName || "DSA App"}
            </div>
            <div className="nav-links">
                <Link
                    to="/"
                    className={`nav-btn ${activePage === "home" ? "active" : ""}`}
                >
                    Home
                </Link>
                <Link
                    to="/learn"
                    className={`nav-btn ${activePage === "learn" ? "active" : ""}`}
                >
                    Learn
                </Link>
                <Link
                    to="/reminders"
                    className={`nav-btn ${activePage === "reminders" ? "active" : ""}`}
                >
                    Reminders
                </Link>
            </div>
            <div className="nav-right">
                <div className="streak-badge">
                    🔥 {navStreak} d
                </div>
                <button className="logout-btn" onClick={handleLogout} title="Sign Out">
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
