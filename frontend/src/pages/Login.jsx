import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import "./Auth.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Please fill in all fields");
            return;
        }

        setLoading(true);
        try {
            const { data } = await loginUser({ email, password });
            sessionStorage.setItem("userInfo", JSON.stringify(data));
            navigate("/");
        } catch (err) {
            setError(
                err.response?.data?.message || "Login failed. Please try again."
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
                    <div className="visual-badge">DSA Mastery</div>
                    <h2 className="visual-title">Welcome Back.</h2>
                    <p className="visual-desc">Sign in to continue tracking your progress, reviewing algorithms, and conquering the interview prep journey.</p>
                </div>
            </div>

            {/* Split Screen Right Side */}
            <div className="auth-form-side">
                <div className="auth-card">
                    <div className="auth-logo">
                        <span className="auth-logo-icon">▲</span>
                    </div>
                    <h1 className="auth-title">Sign In</h1>
                    <p className="auth-subtitle">Login to access your dashboard</p>

                    {error && <div className="auth-error">{error}</div>}

                    <form className="auth-form" onSubmit={handleSubmit}>
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
                                autoComplete="current-password"
                            />
                            <label className="form-label">Password</label>
                        </div>

                        <button
                            type="submit"
                            className="auth-btn"
                            disabled={loading}
                        >
                            {loading ? "Authenticating..." : "Login"}
                        </button>
                    </form>

                    <div className="auth-footer">
                        Don't have an account?{" "}
                        <Link to="/register">Create one</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
