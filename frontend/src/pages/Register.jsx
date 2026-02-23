import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";
import "./Auth.css";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!name || !email || !password || !confirmPassword) {
            setError("Please fill in all fields");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setLoading(true);
        try {
            const { data } = await registerUser({ name, email, password });
            sessionStorage.setItem("userInfo", JSON.stringify(data));
            navigate("/");
        } catch (err) {
            setError(
                err.response?.data?.message || "Registration failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            {/* Split Screen Left Side */}
            <div className="auth-visual">
                <div className="visual-content">
                    <div className="visual-badge">Join Us</div>
                    <h2 className="visual-title">Crack the Code.</h2>
                    <p className="visual-desc">Create your account to unlock curated tracking, smart scheduling, and analytics that level up your interview game.</p>
                </div>
            </div>

            {/* Split Screen Right Side */}
            <div className="auth-form-side">
                <div className="auth-card">
                    <div className="auth-logo">
                        <span className="auth-logo-icon">▲</span>
                    </div>
                    <h1 className="auth-title">Register</h1>
                    <p className="auth-subtitle">Set up your new account in seconds</p>

                    {error && <div className="auth-error">{error}</div>}

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input
                                type="text"
                                className="form-input"
                                placeholder=" "
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                autoComplete="name"
                            />
                            <label className="form-label">Full Name</label>
                        </div>

                        <div className="form-group">
                            <input
                                type="email"
                                className="form-input"
                                placeholder=" "
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                            />
                            <label className="form-label">Email Address</label>
                        </div>

                        <div className="form-group">
                            <input
                                type="password"
                                className="form-input"
                                placeholder=" "
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="new-password"
                            />
                            <label className="form-label">Password</label>
                        </div>

                        <div className="form-group">
                            <input
                                type="password"
                                className="form-input"
                                placeholder=" "
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                autoComplete="new-password"
                            />
                            <label className="form-label">Confirm Password</label>
                        </div>

                        <button
                            type="submit"
                            className="auth-btn"
                            disabled={loading}
                        >
                            {loading ? "Creating account..." : "Sign Up"}
                        </button>
                    </form>

                    <div className="auth-footer">
                        Already have an account?{" "}
                        <Link to="/login">Sign in</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
