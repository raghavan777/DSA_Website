import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getUserProfile, getTopics } from "../services/api";
import "./Home.css";

const Home = () => {
    const [user, setUser] = useState({ name: "User", streak: 0 });
    const [stats, setStats] = useState({
        done: 0,
        left: 0,
        progress: 0
    });
    const [phases, setPhases] = useState([]);
    const [topicBreakdown, setTopicBreakdown] = useState([]);
    const [showDoneModal, setShowDoneModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch user data & topics in parallel
                const [userRes, topicsRes] = await Promise.all([
                    getUserProfile(),
                    getTopics()
                ]);

                if (userRes.data) {
                    setUser({
                        name: userRes.data.name || "User",
                        streak: userRes.data.streak || 0
                    });
                }

                if (topicsRes.data) {
                    let totalProblems = 0;
                    let totalCompleted = 0;

                    // Group tracking for phases
                    const phaseMap = {};
                    // Per-topic breakdown
                    const breakdown = [];

                    topicsRes.data.forEach(topic => {
                        const phaseName = `Phase ${topic.phase || 1}`;
                        if (!phaseMap[phaseName]) {
                            phaseMap[phaseName] = { total: 0, completed: 0 };
                        }

                        let topicTotal = 0;
                        let topicCompleted = 0;

                        if (topic.problems && topic.problems.length > 0) {
                            topic.problems.forEach(prob => {
                                totalProblems++;
                                topicTotal++;
                                phaseMap[phaseName].total++;

                                if (prob.completed) {
                                    totalCompleted++;
                                    topicCompleted++;
                                    phaseMap[phaseName].completed++;
                                }
                            });
                        }

                        breakdown.push({
                            title: topic.title,
                            icon: topic.icon,
                            phase: topic.phase || 1,
                            total: topicTotal,
                            completed: topicCompleted,
                            percentage: topicTotal === 0 ? 0 : Math.round((topicCompleted / topicTotal) * 100)
                        });
                    });

                    // Sort breakdown by phase then title
                    breakdown.sort((a, b) => a.phase - b.phase || a.title.localeCompare(b.title));
                    setTopicBreakdown(breakdown);

                    // Global Stats Calculation
                    const left = totalProblems - totalCompleted;
                    const progress = totalProblems === 0 ? 0 : Math.round((totalCompleted / totalProblems) * 100);

                    setStats({
                        done: totalCompleted,
                        left: left,
                        progress: progress
                    });

                    // Array transformation for the Phase Progress UI
                    const formattedPhases = Object.keys(phaseMap).map(phaseKey => {
                        const pData = phaseMap[phaseKey];
                        const pPercentage = pData.total === 0 ? 0 : Math.round((pData.completed / pData.total) * 100);
                        return {
                            name: phaseKey,
                            percentage: pPercentage,
                            completed: pData.completed,
                            total: pData.total
                        };
                    });

                    // Sort phases nicely if they are strings like "Phase 1", "Phase 2"
                    formattedPhases.sort((a, b) => a.name.localeCompare(b.name));
                    setPhases(formattedPhases);
                }
            } catch (error) {
                console.error("Failed to load dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="home-container">
                <Navbar activePage="home" />
                <div style={{ padding: "60px", textAlign: "center", color: "white" }}>
                    Loading Dashboard...
                </div>
            </div>
        );
    }

    return (
        <div className="home-container">
            {/* EXPORTED NAVBAR */}
            <Navbar activePage="home" />

            {/* DARK HERO SECTION */}
            <section className="hero-section">
                <div className="hero-greeting">
                    <div className="greeting-label">// GOOD EVENING, {user.name.toUpperCase()} 💖</div>
                    <h1 className="main-title">
                        Hey <span className="highlight">{user.name}</span> 👋<br />
                        Crack that job!
                    </h1>
                    <p className="subtext">
                        2nd Year → Dream Placement. One problem a day keeps rejection away 🚀
                    </p>
                </div>

                <div className="stats-grid">
                    <div className="stat-card stat-card-clickable" onClick={() => setShowDoneModal(true)}>
                        <div className="stat-value coral">{stats.done}</div>
                        <div className="stat-label">DONE</div>
                        <div className="stat-hint">Tap to view</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{stats.left}</div>
                        <div className="stat-label">LEFT</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value teal">{stats.progress}%</div>
                        <div className="stat-label">PROGRESS</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value coral">{user.streak}</div>
                        <div className="stat-label">STREAK 🔥</div>
                    </div>
                </div>

                <div className="phase-container">
                    <div className="phase-header">
                        <div className="phase-title">Phase Progress</div>
                        <div className="phase-total">{stats.progress}%</div>
                    </div>
                    <div className="phase-list">
                        {phases.length === 0 ? (
                            <div style={{ color: "#8b9eb0", fontSize: "0.9rem", padding: "10px 0" }}>No phases available yet.</div>
                        ) : (
                            phases.map((phase, idx) => (
                                <div
                                    key={idx}
                                    className="phase-item phase-item-clickable"
                                    onClick={() => navigate(`/learn?phase=${encodeURIComponent(phase.name)}`)}
                                >
                                    <div className="phase-info">
                                        <span>{phase.name}</span>
                                        <span>{phase.completed}/{phase.total} · {phase.percentage}%</span>
                                    </div>
                                    <div className="phase-bar-bg">
                                        <div
                                            className="phase-bar-fill"
                                            style={{ width: `${phase.percentage}%` }}
                                        ></div>
                                    </div>
                                    <div className="phase-item-hint">View topics →</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* LIGHT CONTENT SECTION */}
            <section className="content-section">
                <div className="content-inner">

                    {/* Up Next Card */}
                    <div className="up-next-card">
                        <div className="up-next-label">
                            📍 UP NEXT FOR YOU
                        </div>
                        <h2 className="up-next-title">Big O Notation</h2>
                        <p className="up-next-desc">
                            Understand O(1), O(n), O(n²), O(log n). Critical foundation for every interview.
                        </p>
                        <a href="https://www.youtube.com/watch?v=IR_S8BC8KI0" target="_blank" rel="noopener noreferrer" className="video-btn">
                            ▶ Video
                        </a>
                    </div>

                    {/* Quote Card */}
                    <div className="quote-card">
                        <div className="quote-icon">"</div>
                        <div className="quote-text">
                            The secret to getting ahead is getting started.
                        </div>
                        <div className="quote-author">— Mark Twain</div>
                    </div>

                    {/* Quick Resources */}
                    <div className="resources-section">
                        <h3 className="resources-title">Quick Resources</h3>
                        <div className="resources-grid">
                            <a href="https://neetcode.io/roadmap" target="_blank" rel="noopener noreferrer" className="resource-card" style={{ borderLeft: '3px solid var(--accent-blue)' }}>
                                <span className="r-icon">🗺️</span> NeetCode
                            </a>
                            <a href="https://leetcode.com/problemset/" target="_blank" rel="noopener noreferrer" className="resource-card" style={{ borderLeft: '3px solid var(--accent-amber)' }}>
                                <span className="r-icon">⚡</span> LeetCode
                            </a>
                            <a href="https://www.youtube.com/@abdul_bari" target="_blank" rel="noopener noreferrer" className="resource-card" style={{ borderLeft: '3px solid var(--accent-coral)' }}>
                                <span className="r-icon">📺</span> Abdul Bari
                            </a>
                            <a href="https://www.geeksforgeeks.org/dsa/dsa-tutorial-learn-data-structures-and-algorithms/" target="_blank" rel="noopener noreferrer" className="resource-card" style={{ borderLeft: '3px solid var(--accent-emerald)' }}>
                                <span className="r-icon">📘</span> GFG DSA
                            </a>
                            <a href="https://www.youtube.com/@takeUforward" target="_blank" rel="noopener noreferrer" className="resource-card" style={{ borderLeft: '3px solid var(--accent-blue)' }}>
                                <span className="r-icon">🎯</span> Striver A2Z
                            </a>
                            <a href="https://cs50.harvard.edu/x/" target="_blank" rel="noopener noreferrer" className="resource-card" style={{ borderLeft: '3px solid #ff2a85' }}>
                                <span className="r-icon">🎓</span> CS50
                            </a>
                        </div>
                    </div>

                </div>
            </section>

            {/* DONE MODAL */}
            {showDoneModal && (
                <div className="done-modal-overlay" onClick={() => setShowDoneModal(false)}>
                    <div className="done-modal" onClick={e => e.stopPropagation()}>
                        <div className="done-modal-drag-handle" />
                        <button className="done-modal-close" onClick={() => setShowDoneModal(false)}>✕</button>

                        <h2 className="done-modal-title">📊 Completion Breakdown</h2>
                        <p className="done-modal-subtitle">{stats.done} tasks completed out of {stats.done + stats.left}</p>

                        <div className="done-modal-list">
                            {topicBreakdown.map((topic, idx) => (
                                <div key={idx} className={`done-topic-item ${topic.completed === topic.total && topic.total > 0 ? 'fully-done' : ''}`}>
                                    <div className="done-topic-header">
                                        <div className="done-topic-left">
                                            <span className="done-topic-icon">{topic.icon}</span>
                                            <div>
                                                <div className="done-topic-name">{topic.title}</div>
                                                <div className="done-topic-phase">Phase {topic.phase}</div>
                                            </div>
                                        </div>
                                        <div className="done-topic-right">
                                            <span className="done-topic-count">{topic.completed}/{topic.total}</span>
                                            {topic.completed === topic.total && topic.total > 0 && (
                                                <span className="done-check">✅</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="done-topic-bar-bg">
                                        <div
                                            className="done-topic-bar-fill"
                                            style={{
                                                width: `${topic.percentage}%`,
                                                background: topic.percentage === 100
                                                    ? 'linear-gradient(90deg, #39ff14, #00f0ff)'
                                                    : topic.percentage > 0
                                                        ? 'linear-gradient(90deg, #ffea00, #ff2a85)'
                                                        : 'rgba(255, 255, 255, 0.05)'
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
